module.exports.data = {
  layout: 'layouts/index.11ty.js',
  tags: 'page',
  title: 'contact'
}

module.exports.render = function contact() {
  return /*html*/`
  <h1>Contact</h1>
  <div>
    <form name="contact" netlify>
      <p>
        <label for="contactName">name</label>
        <input type="text" required id="contactName" name="name">
      </p>
      <p>
        <label for="contactEmail">email</label>
        <input type="text" required id="contactEmail" name="email">
      </p>
      <p>
        <label for="contactMessage">message</label>
        <input required id="contactMessage" name="message">
      </p>
      <p>
        <label><input id="contactPromotionalContent" name="promotionalContent"> Send me promotional content</label>
      </p>
      <button>Send</button>
    </form>
  </div>`;
}
