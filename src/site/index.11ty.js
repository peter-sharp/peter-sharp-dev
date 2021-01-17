module.exports.data = {
  layout: 'layouts/index.11ty.js',
  title: 'Home',
  menuIndex: 1,
  tags: 'page'
}

module.exports.render = function index() {
  return /*html*/`
  <header id="pageHero">
    <div>
      <p>Get you business online</p>
      <a class="button" href="/contact">Contact me</a>
    </div>
  </header>
  <section id="services">
    <h2>services</h2>
    <ul>
      <li>Brochure sites</li>
      <li>Ecommerce sites</li>
      <li>Web apps</li>
    </ul>
  </section>
  <section id="contactUs">
    <h2>about</h2>
    Fullstack web developer living in Fairlie, South Canterbury, New Zealand with 4+ years experience designing, delivering and maintaining small to large scale websites and web apps in WordPress as well as a variety of other frameworks.
    </p>
    <p>Being part designer, I care about crafting sites and apps with good user experience that excel in meeting their bottom line.</p>
  </section>
  <section id="contactUs">
    <div>
      <p>make an enquiry</p>
      <a class="button" href="/contact">Contact me</a>
    </div>
  </section>
  `;
}
