const puppeteer = require('puppeteer');
const fs = require('fs');

const websites = [
    // "https://bleepingcomputer.com",
    // "https://hexacorn.com",
    // "https://sentinelone.com",
    
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
    // "https://microsoft.com",
    // "https://washingtonpost.com",
    // "https://reversemode.com",
    // "https://viasat.com",
    // "https://wikipedia.org",
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

// Function to scrape and save text from a website
(async () => {
    // Launch the browser in headless mode (no visible window)
    const browser = await puppeteer.launch({
        headless: false, // Prevent opening a browser window
        defaultViewport: null,
    });

    for (let website of websites) {
        try {
            // Create a new page
            const page = await browser.newPage();

            // Navigate to the website
            await page.goto(website, {
                waitUntil: 'domcontentloaded', // Wait for the DOM to load
                timeout: 0  // Disable timeout (helpful for slower websites)
            });

            // Extract all visible text content from the website
            const pageText = await page.evaluate(() => {
                // Remove unnecessary sections by CSS selectors
                const unwantedSelectors = ['header', 'footer', 'nav', '.navbar', '.footer', '.contact', '.about', '.newsletter'];
                unwantedSelectors.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => el.remove());
                });

                // Now extract the cleaned visible text
                return document.body.innerText.trim();  // Extract all visible text from the body
            });

            // Log the scraped text (you can save this to a file as well)
            console.log(`Scraped data from ${website}:\n`, pageText);

            // Save the scraped text to a file
            fs.appendFileSync('scraped_data.txt', `\n\n===== Scraped from: ${website} =====\n\n${pageText}`);

            // Close the current page
            await page.close();

            console.log(`Scraped data from ${website}`);
        } catch (error) {
            console.error(`Error scraping ${website}: ${error}`);
        }
    }

    // Close the browser
    await browser.close();
    console.log('Scraping completed.');
})();