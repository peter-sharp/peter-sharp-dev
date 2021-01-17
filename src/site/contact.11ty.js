module.exports.data = {
  layout: 'layouts/index.11ty.js',
  tags: 'page',
  title: 'contact',
  menuIndex: 10,
}

module.exports.render = function contact() {
  return /*html*/`
    <form name="contact" netlify class="wrapper pad-top-900">
      <div class="wrapper__inner stack stack--gap-100">
        <h1>Contact</h1>
        <p class="form-group">
          <label for="contactName">name</label>
          <input type="text" required id="contactName" name="name">
        </p>
        <p class="form-group">
          <label for="contactEmail">email</label>
          <input type="email" required id="contactEmail" name="email">
        </p>
        <p class="form-group">
          <label for="contactMessage">message</label>
          <textarea required id="contactMessage" name="message"></textarea>
        </p>
        <p>
          <label><input type="checkbox" id="contactPromotionalContent" name="promotionalContent"> Send me promotional content</label>
        </p>
        <button>Send</button>
      </div>
    </form>`;
}
