import {html, LitElement} from 'lit-element';

class SimplrPageNotFound extends LitElement {
    static get properties() {
        return {
            lang: {type: String}
        };
    }

    constructor() {
        super();
    }

    render() {
        return html`
            <p><b>404</b> Page not found</p>
        `;
    }

    createRenderRoot() {
        return this;
    }
}

if (!customElements.get('simplr-page-not-found')) {
    customElements.define('simplr-page-not-found', SimplrPageNotFound);
}