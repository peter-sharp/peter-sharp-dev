/**
 * Trhottles given function to execute once every given delay of milliseconds
 * @param {Function} fn 
 * @param {Int} wait millisecond delay between calls
 * @returns 
 */
export default function throttle(fn, wait = 50) {
    let inThrottle, lastFn, lastTime;
    return function throttled() {
        const context = this,
            args = arguments;
        if (!inThrottle) {
            fn.apply(context, args);
            lastTime = Date.now();
            inThrottle = true;
        } else {
            lastFn = requestAnimationFrame(function () {
                if (Date.now() - lastTime >= wait) {
                    fn.apply(context, args);
                    lastTime = Date.now();
                }
            });
        }
    };
};