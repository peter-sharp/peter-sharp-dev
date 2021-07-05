import delegate from '/assets/delegate.js';
import throttle from '/assets/throttle.js';

document.addEventListener('pointermove', 
    delegate('[data-image-comparison]', throttle(function imageComparison(ev) {
        const rect = this.getBoundingClientRect();
        const percent = ev.offsetX / rect.width * 100;
        console.log(ev.offsetX, rect.width, percent);
        this.style.setProperty('--percent', `${percent}%`);
})));