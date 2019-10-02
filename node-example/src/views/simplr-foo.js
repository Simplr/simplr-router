import {html, LitElement} from 'lit-element';
import "./simplr-router-link";

class SimplrFoo extends LitElement {
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
            <p>Foo</p>
            <simplr-router-link route="foo/12" title="Foo 12"></simplr-router-link>
        `;
    }

    createRenderRoot() {
        return this;
    }
}

if (!customElements.get('simplr-foo')) {
    customElements.define('simplr-foo', SimplrFoo);
}