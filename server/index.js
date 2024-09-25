const express = require('express');
const cors = require('cors');
const app = express();
const puppeteer = require('puppeteer');
const fs = require('fs');

const { spawn } = require('child_process');

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});
const User = mongoose.model('users', UserSchema);
mongoose.connect('mongodb://0.0.0.0:27017/CyberDetective')
    .then(() => {
        console.log('Connected to CyberDetective database');
    }).catch((err) => {
        console.error('Connection error:', err);
    });

app.use(express.json());
app.use(cors());

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send("Invalid username");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send("Invalid password");
        }

        res.status(200).send("Login successful");
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send("Internal server error");
    }
});

app.post("/register", async (req, res) => {
    const { name, email, username, password } = req.body;
    console.log(name, email, username, password);

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send("Username already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword,
        });

        const result = await newUser.save();
        console.log(result.toObject());
        res.status(200).send("Registration successful");
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send("Internal server error");
    }
});

app.post("/query", async (req, res) => {
    const { query } = req.body;
    console.log(query);

    try {
        const pythonProcess = spawn('python', ['./RAG.py', query]);
        let output = '';

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.on('close', () => {
            console.log(output.trim());
            res.status(200).send(output);
        });
    } catch (error) {
        console.error('Error during query:', error);
        res.status(500).send("Internal server error");
    }
});

const scrapeWebsite = async (url) => {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
    });

    try {
        const page = await browser.newPage();
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 0,
        });

        const pageText = await page.evaluate(() => {
            const unwantedSelectors = ['header', 'footer', 'nav', '.navbar', '.footer', '.contact', '.about', '.newsletter', 'form'];
            unwantedSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => el.remove());
            });
            return document.body.innerText.trim();
        });

        // fs.appendFileSync('scraped_data.txt', `\n\n===== Scraped from: ${url} =====\n\n${pageText}`);

        await page.close();
        await browser.close();
        return pageText;
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        await browser.close();
        throw error;
    }
};

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

app.get("/", (req, res) => {
    res.send("Backend is working");
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
})