#!/usr/bin/env node

const puppeteer = require('puppeteer');

const arguments = process.argv.slice(2);

if (arguments.length === 0) {
    console.log("Usage: tlcheck <username>");
    process.exit()
}

if (arguments[0].toLowerCase().trim() == "--help") {
    console.log("Usage: tlcheck <username>");
    process.exit()
}
if (arguments[0].toLowerCase().trim() == "--version") {
    const data = require('./package.json');
    console.log(data.version);
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
        const offlineButton = document.querySelector("#root > div > div.Layout-sc-nxg1ff-0.bSuLAT > div > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--home.channel-root--unanimated > div.Layout-sc-nxg1ff-0.cIfBon > div.channel-root__player.channel-root__player--offline > div:nth-child(2) > div > div > div > div > div.Layout-sc-nxg1ff-0.bNdJnu > div.InjectLayout-sc-588ddc-0.gMZmTd.home-carousel-info > div.Layout-sc-nxg1ff-0.kXoETa > div > div.Layout-sc-nxg1ff-0.pqFci > div.Layout-sc-nxg1ff-0.iXEwvl.channel-status-info.channel-status-info--offline")
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
