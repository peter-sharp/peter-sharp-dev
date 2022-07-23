const slugify = require('slugify')

module.exports.data = {
  layout: 'layouts/index.11ty.js',
  title: 'Home',
  menuIndex: 1,
  tags: 'page'
}

module.exports.render = function index({ collections }) {
  return /*html*/`
  <header id="pageHero" class="hero centered wrapper wrapper--full-width">
    ${this.svgContents('/src/site/mountain-banner.svg', 'hero__svg-bg')}
    ${this.svgContents('/src/site/mountain-banner-sheep.svg')}
    <div class="wrapper__inner hero__cta stack">
      <h2 class="hero__message">Simple, effective web apps and&nbsp;websites</h2>
      <a class="button hero__button" href="/contact" data-state="inverted">Contact me</a>
    </div>
  </header>
  <section id="services" class="wrapper">
    <div class="wrapper__inner p-note stack stack--gap-500">
      <h2>Services</h2>
      <ul class="unstyled-list">
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
  `;
}
