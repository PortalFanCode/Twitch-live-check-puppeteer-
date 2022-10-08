#!/usr/bin/env node

const puppeteer = require('puppeteer');

var VALID = true
const arguments = process.argv.slice(2);

if (arguments.length === 0) {
    console.log("Please enter a username");
    process.exit()
}

if (arguments[0].toLowerCase().trim() == "--help") {
    console.log("Usage: tlcheck <username>");
    process.exit()
}
process.stdout.write("\n Loading, please wait...\r")
const LINK = "https://www.twitch.tv/" + arguments[0].toLowerCase().trim();

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(LINK, { waitUntil: 'networkidle2' });

    const channelValid = await page.evaluate(() => {
        const error = document.querySelector('p[data-a-target="core-error-message"]')
        if (!error) return true
        return false
    })

    const liveBoolean = await page.evaluate(() => {
        const offlineButton = document.querySelector('.CoreText-sc-cpl358-0.hQCXK')
        if (!offlineButton) return true;
        return false;
    })

    if (channelValid) {
        if (liveBoolean) {
            process.stdout.clearLine();          
            console.log('Live\n')
        } else {
            process.stdout.clearLine();
            console.log('Offline\n')
        }
    } else {
        process.stdout.clearLine();
        console.log('Channel does not exist\n')
    }

    await browser.close();
})();
