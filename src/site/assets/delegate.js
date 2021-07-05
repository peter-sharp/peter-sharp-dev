export default function delegate(elementSelector, handler) {
    return function delegated(ev) {
        // loop parent nodes from the target to the delegation node
        for (let target = ev.target; target && target != this; target = target.parentNode) {
            if (target.matches(elementSelector)) {
                handler.call(target, ev);
                break;
            }
        }
    }
}