/**
 * @returns {Element}
 * */
export function findOutlet() {
    const outlet = deepQuery('simplr-router-outlet');
    return outlet;
}

/**
 * @param {string} target
 * @param {Element | ShadowRoot} [dom]
 *
 * @returns {Element}
 */
export function deepQuery(target, dom = document.body) {
    let foundItem = dom.querySelector(target);
    if (foundItem) return foundItem;
    for (const el of dom.querySelectorAll('*')) {
        if (el.shadowRoot) {
            foundItem = deepQuery(target, el.shadowRoot);
            if (foundItem) break;
        }
    }
    return foundItem;
}
