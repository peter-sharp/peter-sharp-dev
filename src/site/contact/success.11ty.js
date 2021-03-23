module.exports.data = {
  layout: 'layouts/index.11ty.js',
  title: 'contact',
  menuIndex: 10,
}

module.exports.render = function contact() {
  return /*html*/`
    <div class="wrapper  pad-top-900">
      <div class="wrapper__inner stack stack--gap-100">
        <h1>Contact</h1>
        <p class="">
          Message sent!
        </p>

      </div>
    </div>`;
}
