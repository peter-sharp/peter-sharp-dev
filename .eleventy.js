const siteNav = require('./src/site/_includes/collections/siteNav.js');

const svgContents = require("eleventy-plugin-svg-contents");

module.exports = function eleventyConfig(config) {
    config.addPlugin(svgContents);

    config.addPassthroughCopy('src/site/style.css')
    config.addPassthroughCopy('src/site/favicon.svg')

    config.addCollection('siteNav', siteNav);

    return {
        dir: {
            input: 'src/site'
        }
    }
}
