// Notice a proper package name in require
const { chromium } = require('playwright-chromium');
const path = require('path');

/**
 * Generates a pdf in _site/downloads of webpage at given url
 * @param {String} url 
 * @returns {Void}
 */
module.exports = async function generateResumePDF(urls) {
  const pdfs = await Promise.all(urls.map(async url => {
    const browser = await chromium.launch();
    try {
    const page = await browser.newPage();
    const source = `file://${path.resolve(__dirname, '../_site', url.replace(/^\//, ''), 'index.html').replace(/\\/g, '\/')}`;
    const destination = path.resolve(__dirname, '../_site/downloads', `${url}.pdf`);
    console.log('printing PDF of', source, 'to', destination);
    await page.goto(source);
    await page.pdf({ path: destination, format: 'A4' });
    await browser.close();

    return [source, destination];
    } catch (e) {
      return e;
    }
  }));
  return pdfs;
};