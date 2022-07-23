// Notice a proper package name in require
const { chromium } = require('playwright-chromium');
const path = require('path');
const  { unary } = require('ramda');
const graymatter = require('gray-matter');
const { readFile, readdir, copyFile } = require('fs').promises;
const slugify = require('slugify');

module.exports = async function generatePortfolioImages() {
    const files = await (await readdir(path.resolve('src/site/portfolio'))).filter(x => x.includes('.md'));
    
    const links = await Promise.all(files.map(async function getLink(x){
        const text = await readFile(path.resolve('src/site/portfolio', x), 'utf8');
        const { data = {} } = graymatter(text);
        return data.link;
    }));

    const browser = await chromium.launch();
    const images = await Promise.all(links.map(async link => {
        const page = await browser.newPage();
        const imgPath = path.resolve('_site/assets', `${slugify(link)}.jpg`);
        const portfolioDest = path.resolve('_site/resume', `${slugify(link)}.jpg`);
        try {
            const url = link.startsWith('/') ? `file://${path.resolve(__dirname, '..', '_site' + link, 'index.html')}` : `https://${link}`;
            console.log('Taking screenshot of', url, 'to', imgPath);
            await page.goto(url);
            await page.screenshot({ width: 500, height: 500, type: 'jpeg', path: imgPath });
            // copy to resume 
            await copyFile(imgPath, portfolioDest);
        } catch (e) {
            return new Error(`failed to screenshot ${link}`);
        }
        return [imgPath, portfolioDest];
    }));
    images.forEach(unary(console.info));
    await browser.close();
};