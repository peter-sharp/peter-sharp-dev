const imageComparison = require('../_includes/components/imageComparison.js');

module.exports.data = {
    title: "Illustration"
};

module.exports.render = function render({ collections }) {
    return /*html*/`
        <div class="wrapper pad-top-900">
            <header class="wrapper__inner  stack stack--gap-100">
            <h1>Illustration</h1>
            <p>Need something for a catchy Call to action, a unique blog post image, or a website hero image? I can help.</p>
            </header>
        </div>
        <section class="stack stack--gap-500">
            <div class="wrapper">
                <div class="wrapper__inner  stack stack--gap-100">
                    <h2>Micro-jobs</h2>
                    <p>Have a strict budget? Check out these micro-jobs.</p>
                </div>
            </div>
            <ul class="gallery" size="thumbnail">
            ${collections.microJob.map(x => /*html*/`<li class="gallery__card card">
                 <figure class="stack stack--gap-100">
                    ${'imageComparison' in x.data ?
                    imageComparison(x.data.imageComparison.imageA, x.data.imageComparison.imageB) :
                    /*html*/`<img class="card__image" width="150" height="150" src="${x.data.thumbnail}"/>`}
                    <figcaption class="card__title stack stack--gap-100">
                        <h3><a class="card__link" href="https://${x.data.link}">${x.data.title}</a></h3>
                        <p class="price-badge">$${x.data.price} <strong>${x.data.currency}</strong></p>
                    </figcaption>
                    </figure>
            </li>`).join('\n')}
            </ul>
        </section>
    `
}
