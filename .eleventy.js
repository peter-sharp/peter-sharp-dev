require('dotenv').config();

const siteNav = require('./src/site/_includes/collections/siteNav.js');

const svgContents = require("eleventy-plugin-svg-contents");
const copy = require("recursive-copy");

const pluginWebc = require("@11ty/eleventy-plugin-webc");
const { EleventyRenderPlugin } = require("@11ty/eleventy");




/**
 * Configues petersharp.dev site:
 *  - adds svg contents plugin
 *  - copies over css, and image assets
 *  - adds site navigation collection
 *  - adds work/education thistroy collections
 *  - adds gallery shortcode
 *  - after build, generates resume pdfs and portfolio thumnails
 *  - watches svg banner
 * @param {UserConfig} config 
 * @returns {Object}
 */
module.exports = function eleventyConfig(config) {
    config.setDataDeepMerge(true);

    config.addPlugin(pluginWebc, {
        components: "src/site/_includes/components/**/*.webc",
    });
    config.addPlugin(EleventyRenderPlugin);
    config.addPlugin(svgContents);

    config.addPassthroughCopy('src/site/style.css');
    config.addPassthroughCopy('src/site/assets');
    config.addPassthroughCopy({'src/site/assets/gallery.css' : 'resume/gallery.css'});
    config.addPassthroughCopy('src/site/resume/*.css');
    config.addPassthroughCopy('src/site/favicon.svg');
    config.addPassthroughCopy('src/site/social-media-banner.png');

    config.addPassthroughCopy('src/site/portfolio-demos/bitprime-about-us/About Us _ BitPrime_files');

    config.addCollection('siteNav', siteNav);

    function byStartDate (a, b) {
      return b.data.start - a.data.start; // sort by date - descending);
    }
    for(let cvType of ['it', 'general']) {
        config.addCollection(`${cvType}Work`, function(collectionApi) {
            return collectionApi.getFilteredByTags("work", "history", cvType).sort(byStartDate);
        });
        config.addCollection(`${cvType}Education`, function(collectionApi) {
            return collectionApi.getFilteredByTags("education", "history", cvType).sort(byStartDate);
        });
    }

    config.on('afterBuild', async () => {
        if(process.env.SKIP_AFTER_BUILD) return;
        let generateResumePDF;
        let generatePortfolioImages;
        try {
            generateResumePDF = require("./scripts/generate-resume-PDF.js");
            generatePortfolioImages = require("./scripts/generate-portfolio-images.js");
            console.info('post install scripts loaded');
        } catch(e) {
            console.error(e);
            return;
        }
       
        try {
            const images = await generatePortfolioImages();
            console.info('portfolio images generated:\n', images.map(msgOnError(([src, dest, destRes]) => `${src} to ${dest}, ${destRes}`)).join("\n"));
        } catch (e) {
            console.error(e);
        }

        try {
            
          

            await copy('src/site/assets/gallery.css', '_site/resume/gen/gallery.css', { overwrite: true });
            await copy('src/site/resume', '_site/resume/gen', { filter: '*.css', overwrite: true });
            await copy('src/site/resume', '_site/resume/nz', { filter: '*.css', overwrite: true });
            const pdfs = await generateResumePDF(['resume','resume/gen']);
            
            console.info(`resume PDFs generated: \n`, pdfs.map(msgOnError(([src, dest]) =>  `${src} to ${dest}`)).join("\n"));
        } catch (e) {
            console.error(e);
        }
    });
    function msgOnError(fn) {
        return (x) => x instanceof Error ? x.message : fn(x);
    }

    config.addWatchTarget("./src/site/mountain-banner.svg");
    
    return {
        dir: {
            input: 'src/site'
        }
    }
}
