/*

 */

export default class SimplrRouterTopNav extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<nav class="top-nav">
    <a data-simplr-route href="/">Home</a>
    <a data-simplr-route href="/about">About</a>
    <a data-simplr-route href="/contributing">Contributing</a>
</nav>`;
    }

    createRenderRoot() {
        return this;
    }
}

if (!customElements.get('simplr-router-top-nav')) {
    customElements.define('simplr-router-top-nav', SimplrRouterTopNav);
}
