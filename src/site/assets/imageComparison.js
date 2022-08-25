import delegate from '/assets/delegate.js';
import throttle from '/assets/throttle.js';

/**
 * Creates a before/after image comparison effect on an image container with 
 * the data-image-comparison attribute added
 */
document.addEventListener('pointermove', 
    delegate('[data-image-comparison]', throttle(function imageComparison(ev) {
        const rect = this.getBoundingClientRect();
        
        // Fix for FF
        const offsetX = ev.offsetX || ev.clientX - rect.left;

        const percent = offsetX / rect.width * 100;
        this.style.setProperty('--percent', `${percent}%`);
})));