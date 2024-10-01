const express = require('express');
const cors = require('cors');
const app = express();
const puppeteer = require('puppeteer');
const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://0.0.0.0:27017/CyberDetective')
    .then(() => {
        console.log('Connected to CyberDetective database');
    })
    .catch((err) => {
        console.error('Connection error:', err);
    });

const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    username: { type: String, unique: true },
    password: String
});

const User = mongoose.model('users', UserSchema);

const WebsiteDataSchema = new mongoose.Schema({
    url: String,
    scrapedText: String,
    tokens: [{
        word: String,
        token: String,
        count: Number,
        tag: String
    }]
});

const WebsiteData = mongoose.model('tokens', WebsiteDataSchema);

app.use(express.json());
app.use(cors());

const scrapeWebsite = async (url) => {
    const browser = await puppeteer.launch({ headless: true });
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

const dataset = JSON.parse(fs.readFileSync('./train.json'));

const createTokenClassMap = (dataset) => {
    const tokenClassMap = new Map();

    dataset.forEach(entry => {
        entry.tokens.forEach((token, index) => {
            const word = token.toLowerCase();
            const tag = entry.tags[index];

            if (!tokenClassMap.has(word)) {
                tokenClassMap.set(word, {});
            }

            const tagCountMap = tokenClassMap.get(word);

            if (!tagCountMap[tag]) {
                tagCountMap[tag] = 0;
            }

            tagCountMap[tag] += 1;
        });
    });

    return tokenClassMap;
};

const tokenClassMap = createTokenClassMap(dataset);

const extractRelevantTokens = (text) => {
    const words = text.split(/\s+/);
    const relevantTokens = [];

    words.forEach(word => {
        const cleanedWord = word.toLowerCase().replace(/[.,!?]/g, '');

        if (tokenClassMap.has(cleanedWord)) {
            const tagCountMap = tokenClassMap.get(cleanedWord);

            let mostFrequentTag = null;
            let maxCount = 0;

            for (const [tag, count] of Object.entries(tagCountMap)) {
                if (count > maxCount) {
                    mostFrequentTag = tag;
                    maxCount = count;
                }
            }

            relevantTokens.push({
                word: cleanedWord,
                count: 1,
                tag: mostFrequentTag
            });
        }
    });

    return relevantTokens;
};

const processWebsiteData = async (url) => {
    try {
        const scrapedText = await scrapeWebsite(url);
        const relevantTokens = extractRelevantTokens(scrapedText);

        console.log('Relevant Tokens:', relevantTokens);

        const websiteData = new WebsiteData({
            url,
            scrapedText,
            tokens: relevantTokens
        });

        await websiteData.save();
        console.log('Website data saved to database');

    } catch (error) {
        console.error('Error processing website:', error);
    }
};

app.post('/tokens', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        await processWebsiteData(url);
        res.status(200).send('Website data processed and tokens saved');
    } catch (error) {
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

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

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
        res.status(200).send("Registration successful");
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send("Internal server error");
    }
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
