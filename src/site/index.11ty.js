const slugify = require('slugify')

module.exports.data = {
  layout: 'layouts/index.11ty.js',
  title: 'Home',
  menuIndex: 1,
  tags: 'page',
  parallax: true
}

module.exports.render = function index({ collections }) {
  return /*html*/`
  <header id="pageHero" class="hero wrapper wrapper--full-width parallax__group">
    <div class="sky parallax__layer hero-layer__sky"  data-depth="300"></div>
    <div class="hero__svg-bg parallax__layer hero-layer__mountain"  data-depth="200">
    ${this.svgContents('/src/site/mountain-banner-mountain-bg.svg')}
    </div>
    <div class="parallax__layer hero-layer__clouds" data-depth="100"></div>
    <div class="wrapper__inner centered parallax__layer hero-layer__cta" data-depth="0">
      <div class=" hero__cta stack">
        <h2 class="hero__message">Simple, effective web apps and&nbsp;websites</h2>
        <a class="button hero__button" href="/contact" data-state="inverted">Contact me</a>
      </div>
    </div>
    <div class="parallax__layer hero-layer__sheep" data-depth="0">
    ${this.svgContents('/src/site/mountain-banner-mountain-fg.svg')}
    ${this.svgContents('/src/site/mountain-banner-sheep.svg')}
    </div>
  </header>
  <div class="parallax__group bg-color pad-top-900 stack stack--gap-900" >
    <section id="services" class="wrapper">
      <div class="wrapper__inner p-note stack stack--gap-500">
        <h2>Services</h2>
        <ul class="unstyled-list cluster" data-justify="space-between">
          <li class="emoji" emoji="rocket">Web apps</li>
          <li class="emoji" emoji="page">Brochure websites</li>
          <li class="emoji" emoji="shopping-cart">Ecommerce websites</li>
          <li class="emoji" emoji="artist-palette"><a href="/services/illustration" >Illustration</a></li>
        </ul>
      </div>
    </section>
    <section id="about" class="wrapper">
      <div class="wrapper__inner p-note stack stack--gap-500">
          <h2>About</h2>
          <p>Fullstack web developer living in Montana <span class="p-country-name">USA</span> with 5+ years professional experience designing, delivering and maintaining small to large scale websites and web apps.
          </p>
          <p>I care about crafting creative web solutions with good user experience that excel in meeting their bottom line.</p>
      </div>
    </section>
    <section id="portfolio">
      <div class="stack stack--gap-500">
        <header class="wrapper">
          <h2 class="wrapper__inner">portfolio</h2>
        </header>
        <ul class="gallery">
          ${collections.portfolio.map(x => /*html*/`<li class="card gallery__card">
          <figure class="stack">
            <img class="card__image" width="500" height="281" src="/assets/${slugify(x.data.link)}.jpg"/>
            <figcaption class="card__title">
              <h3><a class="card__link" href="${x.data.link.startsWith('/') ? x.data.link : `https://${x.data.link}`}">${x.data.title}</a></h3>
              <span>${x.data.subtitle}</span>
            </figcaption>
          <figure>
          </li>`).join('\n')}
        </ul>
      </div>
    </section>
    <section id="contactUs" class="wrapper cta">
      <div class="wrapper__inner stack stack--gap-100">
        <p>Make an enquiry</p>
        <a class="cta__button button" href="/contact" data-state="inverted">Contact me</a>
      </div>
    </section>
  </div>
  `;
}
