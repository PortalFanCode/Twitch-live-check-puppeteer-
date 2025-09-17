const puppeteer = require('puppeteer');
const prompt = require('prompt-sync')();

const CHANNEL_NAME = prompt("Please enter the channel's name: ")
const LINK = "https://www.twitch.tv/" + CHANNEL_NAME.toLowerCase().trim();

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(LINK, { waitUntil: 'networkidle2' });

    const channelValid = await page.evaluate(() => {
        const error = document.querySelector('p[data-a-target="core-error-message"]')
        if (!error) {
            return true
        } else {
            return false
        }
    })

    const liveBoolean = await page.evaluate(() => {
        const offlineButton = document.querySelector('.CoreText-sc-cpl358-0.hQCXK')
        if (!offlineButton) return true;
        return false;
    })

    if (channelValid) {
        if (liveBoolean) {
            console.log('Live')
        } else {
            console.log('Offline')
        }
    } else {
        console.log('Channel does not exist')
    }

    await browser.close();
})();