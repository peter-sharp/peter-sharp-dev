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
      <a class="button" href="/contact" data-state="inverted">Contact me</a>
    </div>
  </header>
  <section id="services" class="wrapper">
    <div class="wrapper__inner p-note stack stack--gap-100">
      <h2>Services</h2>
      <ul>
        <li>Web apps</li>
        <li>Brochure websites</li>
        <li>Ecommerce websites</li>
      </ul>
    </div>
  </section>
  <section id="about" class="wrapper">
    <div class="wrapper__inner p-note stack stack--gap-100">
        <h2>About</h2>
        <p>Fullstack web developer living in <span class="p-country-name">New Zealand</span> with 4+ years professional experience designing, delivering and maintaining small to large scale websites and web apps.
        </p>
        <p>I care about crafting creative web solutions with good user experience that excel in meeting their bottom line.</p>
    </div>
  </section>
  <section id="portfolio" class=" stack">
    <header class="wrapper">
      <h2 class="wrapper__inner">portfolio</h2>
    </header>
    <ul class="gallery">
      ${collections.portfolio.map(x => /*html*/`<li class="card gallery__card">
      <figure>
        <img class="card__image" width="500" height="281" src="/assets/${x.data.link}.jpg"/>
        <figcaption class="card__title stack stack--gap-100">
          <h3><a class="card__link" href="https://${x.data.link}">${x.data.title}</a></h3>
          <p>${x.data.subtitle}</p>
        </figcaption>
      <figure>
      </li>`).join('\n')}
    </ul>
  </section>
  <section id="contactUs" class="wrapper cta">
    <div class="wrapper__inner">
      <p>Make an enquiry</p>
      <a class="button" href="/contact">Contact me</a>
    </div>
  </section>
  `;
}
