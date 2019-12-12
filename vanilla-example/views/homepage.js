export default class SimplrRouterHomepage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<div class="container homepage">
                            <div class="wrapper">
                                <h2>Simplr Router</h2>
                                <p>Simplr Router is a light routing library for creating Single Page Applications</p>
                            </div>
                          </div>`;
    }

    createRenderRoot() {
        return this;
    }
}

if (!customElements.get('simplr-router-homepage')) {
    customElements.define('simplr-router-homepage', SimplrRouterHomepage);
}
