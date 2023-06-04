require('dotenv').config();

const siteNav = require('./src/site/_includes/collections/siteNav.js');
const galleryShortcode = require('./src/site/_includes/components/gallery.js');

const svgContents = require("eleventy-plugin-svg-contents");
const copy = require("recursive-copy");

const pluginWebc = require("@11ty/eleventy-plugin-webc");
const { EleventyRenderPlugin } = require("@11ty/eleventy");



let private;
try {
    private = require("./private/.eleventy.js");
} catch(e) {
    console.log('Failed to load private module...');
}
/**
 * Configues petersharp.dev site:
 *  - adds svg contents plugin
 *  - adds private submodule if it exists
 *  - copies over css, and image assets
 *  - adds site navigation collection
 *  - adds work/education thistroy collections
 *  - adds gallery shortcode
 *  - after build, generates resume pdfs and portfolio thumnails
 *  - watches svg banner
 *  - disables gitignore for source of ignored files for eleventy so private files can be used
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
    if(private) config.addPlugin(private);

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

    config.addShortcode('gallery', galleryShortcode);

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
            console.info('portfolio images generated:\n', images.map(([src, dest, destRes]) => `${src} to ${dest}, ${destRes}`).join("\n"));
        } catch (e) {
            console.error(e);
        }

        try {
            
            const [src, dest] = await generateResumePDF('resume');

            await copy('src/site/assets/gallery.css', '_site/resume/gen/gallery.css', { overwrite: true });
            await copy('src/site/resume', '_site/resume/gen', { filter: '*.css', overwrite: true });
            await copy('src/site/resume', '_site/resume/nz', { filter: '*.css', overwrite: true });
            const [srcGen, destGen] = await generateResumePDF('resume/gen');
            
            console.info(`resume PDFs generated: \n ${src} to ${dest} \n ${srcGen} to ${destGen} `);
        } catch (e) {
            console.error(e);
        }
    });

    config.addWatchTarget("./src/site/mountain-banner.svg");
   
    config.setUseGitIgnore(false);
    
    return {
        dir: {
            input: 'src/site'
        }
    }
}
