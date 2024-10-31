const express = require('express');
const cors = require('cors');
const app = express();
const puppeteer = require('puppeteer');
const fs = require('fs'); 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { spawn } = require('child_process');
const axios = require('axios');
require('dotenv').config(); 

app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

// console.log('Connecting to MongoDB:', mongoURI); 
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Database connection error:', err));

const UserSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('users', UserSchema);

const WebsiteDataSchema = new mongoose.Schema({
    url: String,
    scrapedText: String,
    tokens: [{
        word: String,
        count: Number,
        tag: String
    }]
});

const WebsiteData = mongoose.model('tokens', WebsiteDataSchema);


const scrapeWebsite = async (url) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });

        const pageText = await page.evaluate(() => {
            const unwantedSelectors = ['header', 'footer', 'nav', '.navbar', '.footer', '.contact', '.about', '.newsletter'];
            unwantedSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => el.remove());
            });
            return document.body.innerText.trim();
        });

        await browser.close();
        return pageText;

    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        await browser.close();
        throw error;
    }
};

const processWebsiteData = async (url) => {
    try {
        const scrapedText = await scrapeWebsite(url);

        const response = await axios.post(`http://${process.env.PYTHON_URI}/annotate`, {
            input_sentence: scrapedText
        }); 

        const wordData = response.data;

        const websiteData = new WebsiteData({
            url,
            scrapedText,
            tokens: wordData
        });

        await websiteData.save();

        return { scrapedText, wordData };
    } catch (error) {
        console.error('Error processing website:', error);
        return { error: 'Failed to process website' };
    }
};

app.post('/tokens', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const { scrapedText, wordData } = await processWebsiteData(url);

        res.status(200).json(wordData);
    } catch (error) {
        console.error('Error processing website:', error);
        res.status(500).json({ error: 'Failed to process website' }); 
    }
});

app.post('/scrape', async (req, res) => {
    const { url } = req.body;
    console.log("Scraping website:", url);
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const scrapedText = await scrapeWebsite(url);
        console.log("Scraping complete");
        res.json({ text: scrapedText });
    } catch (error) {
        res.status(500).json({ error: 'Failed to scrape the website' });
    }
});

app.post('/query', async (req, res) => {
    const { query } = req.body;
    console.log("Querying:", query);

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        const response = await axios.post(`http://${process.env.PYTHON_URI}/query`, { query });

        if (response.status === 200) {
            res.json(response.data);
        } else {
            res.status(response.status).json({ error: response.data.error });
        }
    } catch (error) {
        console.error('Error fetching from Python service:', error);
        res.status(500).json({ error: 'Failed to fetch the answer from the Python service' });
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log('Login request:', username, password);
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send("Invalid username");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).send("Invalid password");

        res.status(200).send("Login successful");
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send("Internal server error");
    }
});

app.post("/register", async (req, res) => {
    const { name, email, username, password } = req.body;
    console.log('Registration request:', name, email, username, password);

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).send("Username already exists");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword
        });

        await newUser.save();
        console.log('User saved:', newUser);
        res.status(200).send("Registration successful");

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send("Internal server error");
    }
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
