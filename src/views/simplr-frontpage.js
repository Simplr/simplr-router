import {html, LitElement} from 'lit-element';

class SimplrFrontpage extends LitElement {
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
            <p>Frontpage</p>
        `;
    }

    createRenderRoot() {
        return this;
    }
}

if (!customElements.get('simplr-frontpage')) {
    customElements.define('simplr-frontpage', SimplrFrontpage);
}