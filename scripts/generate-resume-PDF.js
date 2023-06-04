// Notice a proper package name in require
const { chromium } = require('playwright-chromium');
const path = require('path');

/**
 * Generates a pdf in _site/downloads of webpage at given url
 * @param {String} url 
 * @returns {Void}
 */
module.exports = async function generateResumePDF(url) {
  const browser = await chromium.launch();
    const page = await browser.newPage();
    const source = `file://${path.resolve(__dirname, '../_site', url.replace(/^\//, ''), 'index.html').replace(/\\/g, '\/')}`;
    const destination = path.resolve(__dirname, '..', '_site/','downloads', `${url}.pdf`);
    await page.goto(source);
    await page.pdf({ path: destination, format: 'A4' });
    await browser.close();

    return [source, destination];
};