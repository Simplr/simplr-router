import {html, LitElement} from 'lit-element';

class SimplrRouterLink extends LitElement {
    static get properties() {
        return {
            route: {type: String},
            title: {type: String}
        };
    }

    constructor() {
        super();
    }

    render() {
        return html`
            <a href="${this.route}" data-simplr-route>${this.title}</a>
        `;
    }

    createRenderRoot() {
        return this;
    }
}

if (!customElements.get('simplr-router-link')) {
    customElements.define('simplr-router-link', SimplrRouterLink);
}