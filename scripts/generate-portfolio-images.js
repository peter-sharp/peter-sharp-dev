// Notice a proper package name in require
const { chromium } = require('playwright-chromium');
const path = require('path');
const  { unary } = require('ramda');
const graymatter = require('gray-matter');
const { readFile, readdir, copyFile } = require('fs').promises;
const slugify = require('slugify');

/**
 * Generates images from sites listed in portfolio collection
 * @returns {Void}
 */
module.exports = async function generatePortfolioImages() {
    const files = await (await readdir(path.resolve('src/site/portfolio'))).filter(x => x.includes('.md'));
    
    const links = await Promise.all(files.map(async function getLink(x){
        const text = await readFile(path.resolve('src/site/portfolio', x), 'utf8');
        const { data = {} } = graymatter(text);
        return data.link;
    }));

    const images = await Promise.all(links.map(async link => {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        const slugifiedLink = slugify(link);
        const imgPath = path.resolve(__dirname, '../_site/assets', `${slugifiedLink}.jpg`);
        const portfolioDest = path.resolve(__dirname, '../_site/resume', `${slugifiedLink}.jpg`);

        const source = link.startsWith('/') ? `file://${path.resolve(__dirname, '../_site', link.replace(/^\//, ''), 'index.html').replace(/\\/g, '\/')}` : `https://${link}`;
        try {
            console.log('Taking screenshot of', source, 'to', imgPath);
            await page.goto(source);
            await page.screenshot({ width: 500, height: 500, type: 'jpeg', path: imgPath });
            // copy to resume 
            await copyFile(imgPath, portfolioDest);
        } catch (e) {
            return new Error(`failed to screenshot ${link}`);
        }
        await browser.close();
        return [source, imgPath, portfolioDest];
    }));
    
    return images;
};