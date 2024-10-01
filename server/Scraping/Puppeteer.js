const puppeteer = require('puppeteer');
const fs = require('fs');
const mongoose = require('mongoose');

const websites = [
    // "https://bleepingcomputer.com",
    // "https://hexacorn.com",
    // "https://sentinelone.com",
    // "https://malwarebytes.com"
    // "https://crowdstrike.com",
    // "https://reuters.com",
    // "https://att.com",
    // "https://kaspersky.com",
    // "https://webroot.com",
    // "https://welivesecurity.com",
    // "https://virusbulletin.com",
    // "https://tadviser.com",
    // "https://forumspb.com",
    // "https://netresec.com",
    // "https://brighttalk.com",
    // "https://libevent.org",
    // "https://fortinet.com",
    // "https://washingtonpost.com",
    // "https://reversemode.com",
    // "https://viasat.com",
    // "https://wired.com",
    // "https://cisa.gov",
    // "https://airforcemag.com",
    // "https://businesswire.com",
    // "https://cyberuk.co.uk",
    // "https://proofpoint.com",
    // "https://fb.com",
    // "https://withsecure.com",
    // "https://techcrunch.com",
    // "https://mozilla.org",
    // "https://humansecurity.com",
    // "https://nist.gov",
    // "https://intel471.com",
    // "https://morphisec.com",
    // "https://payplug.com",
    // "https://sophos.com",
    // "https://coretech.com",
    // "https://stratixsystems.com",
    // "https://crayondata.com",
    // "https://medium.com",
    // "https://cybergeeks.com",
    // "https://gridinsoft.com",
    // "https://securin.io",
    // "https://rsisecurity.com",
    // "https://itgovernance.co.uk",
    // "https://digitalguardian.com",
    // "https://ironnet.com",
    // "https://threatconnect.com",
    // "https://protectuk.police.uk",
    // "https://forbes.com"
];

// Load your dataset (train.json)
const dataset = JSON.parse(fs.readFileSync('../train.json'));

// Function to create a token-class map from the dataset
const createTokenClassMap = (dataset) => {
    const tokenClassMap = new Map();

    dataset.forEach(entry => {
        entry.tokens.forEach((token, index) => {
            const word = token.toLowerCase();
            const tag = entry.tags[index];

            // Check if the word is already in the map
            if (!tokenClassMap.has(word)) {
                tokenClassMap.set(word, {});
            }

            // Get the current tag count map for the word
            const tagCountMap = tokenClassMap.get(word);

            // Initialize the tag count if it doesn't exist
            if (!tagCountMap[tag]) {
                tagCountMap[tag] = 0;
            }

            // Increment the tag count
            tagCountMap[tag] += 1;
        });
    });

    return tokenClassMap;
};

// Generate token-class map
const tokenClassMap = createTokenClassMap(dataset);

// Function to scrape and filter text from a website
const scrapeWebsite = async (url) => {
    const browser = await puppeteer.launch({
        headless: true, // Run headless browser (no GUI)
        defaultViewport: null,
    });

    try {
        const page = await browser.newPage();
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 0,
        });

        const pageText = await page.evaluate(() => {
            const unwantedSelectors = ['header', 'footer', 'nav', '.navbar', '.footer', '.contact', '.about', '.newsletter'];
            unwantedSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => el.remove());
            });
            return document.body.innerText.trim();
        });

        await page.close();
        await browser.close();

        return pageText;

    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        await browser.close();
        throw error;
    }
};

// Function to extract and count relevant tokens, and select the tag with the highest occurrence
const extractRelevantTokens = (text) => {
    const words = text.split(/\s+/);  // Split by spaces to get individual words
    const relevantTokens = {};

    words.forEach(word => {
        const cleanedWord = word.toLowerCase().replace(/[.,!?]/g, '');  // Clean punctuation and lowercase

        // Check if the word is in the token-class map
        if (tokenClassMap.has(cleanedWord)) {
            const tagCountMap = tokenClassMap.get(cleanedWord);

            // Find the tag with the highest count
            let mostFrequentTag = null;
            let maxCount = 0;

            for (const [tag, count] of Object.entries(tagCountMap)) {
                if (count > maxCount) {
                    mostFrequentTag = tag;
                    maxCount = count;
                }
            }

            // If word exists in map, count it and associate with most frequent tag
            if (!relevantTokens[cleanedWord]) {
                relevantTokens[cleanedWord] = { count: 0, tag: mostFrequentTag };
            }

            relevantTokens[cleanedWord].count += 1; // Increment count for this word
        }
    });

    return relevantTokens;
};

// Example function to scrape a website and filter relevant tokens
const processWebsiteData = async (url) => {
    try {
        const scrapedText = await scrapeWebsite(url);
        const relevantTokens = extractRelevantTokens(scrapedText);

        console.log("Relevant Tokens:", relevantTokens);

        mongoose.connect('mongodb://localhost:27017/CyberDetective')
            .then(() => {
                console.log("Connected to CyberDetective database");
            }).catch((error) => {
                console.error("Error connecting to database:", error);
            });
    } catch (error) {
        console.error("Error processing website:", error);
    }
};

// Call the function with a URL to process it
processWebsiteData('https://sentinelone.com');
