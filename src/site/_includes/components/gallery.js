module.exports = function gallery(collection, size = '', justify = '', local = false) {
    return /*html*/`<ul class="gallery" ${size && `size="${size}"`} ${justify && `justify="${justify}"`}>
        ${collection.map(x => /*html*/`<li class="card gallery__card">
        <figure class="stack">
          <img class="card__image" width="500" height="281" src="${local ? '' : '/assets/'}${x.data.link}.jpg"/>
          <figcaption class="card__title">
            <strong><a class="card__link" href="https://${x.data.link}">${x.data.title}</a></strong>
            <span>${x.data.subtitle}</span>
          </figcaption>
        <figure>
        </li>`).join('\n')}
    </ul>`;
}