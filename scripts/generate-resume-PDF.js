// Notice a proper package name in require
const { chromium } = require('playwright-chromium');
const path = require('path');

module.exports = async function generateResumePDF(url) {
  const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(`file://${path.resolve('_site/'+url+'/index.html')}`);
    await page.pdf({ path: `_site/downloads/${url}.pdf`, format: 'A4' });
    await browser.close();
};