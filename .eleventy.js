require('dotenv').config();

const siteNav = require('./src/site/_includes/collections/siteNav.js');
const generateResumePDF = require("./scripts/generate-resume-PDF.js");

const svgContents = require("eleventy-plugin-svg-contents");

module.exports = function eleventyConfig(config) {
    config.setDataDeepMerge(true);

    config.addPlugin(svgContents);

    config.addPassthroughCopy('src/site/style.css')
    config.addPassthroughCopy('src/site/resume/*.css')
    config.addPassthroughCopy('src/site/favicon.svg')
    config.addPassthroughCopy('src/site/social-media-banner.png')

    config.addCollection('siteNav', siteNav);

    for(let cvType of ['it', 'general']) {
        config.addCollection(`${cvType}Work`, function(collectionApi) {
            return collectionApi.getFilteredByTags("work", "history", cvType).reverse();
        });
        config.addCollection(`${cvType}Education`, function(collectionApi) {
            return collectionApi.getFilteredByTags("education", "history", cvType).reverse();
        });
    }

    config.on('afterBuild', async () => {
        try {
            await generateResumePDF();
            console.info('resume PDF generated');
        } catch (e) {
            console.error(e);
        }
    });

    config.addWatchTarget("./src/site/mountain-banner.svg");

    return {
        dir: {
            input: 'src/site'
        }
    }
}
