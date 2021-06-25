module.exports.data = {
  layout: 'layouts/index.11ty.js',
  title: 'Home',
  menuIndex: 1,
  tags: 'page'
}

module.exports.render = function index() {
  return /*html*/`
  <header id="pageHero" class="hero centered wrapper">
    <div class="wrapper__inner stack stack--gap-100">
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
  <section id="contactUs" class="wrapper">
    <div class="wrapper__inner p-note stack stack--gap-100">
        <h2>About</h2>
        <p>Fullstack web developer living in <span class="p-country-name">New Zealand</span> with 4+ years experience designing, delivering and maintaining small to large scale websites and web apps.
        </p>
        <p>Being part designer, I care about crafting sites and apps with good user experience that excel in meeting their bottom line.</p>
    </div>
  </section>
  <section id="contactUs" class="wrapper cta">
    <div class="wrapper__inner">
      <p>Make an enquiry</p>
      <a class="button" href="/contact">Contact me</a>
    </div>
  </section>
  `;
}
