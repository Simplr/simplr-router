import { html, LitElement } from 'lit-element';
import SimplrRouter from '../../../lib/simplr-router';

class SimplrFrontpage extends LitElement {
    static get properties() {
        return {
            lang: { type: String },
        };
    }

    constructor() {
        super();
    }

    render() {
        return html`
            <p>Hello world</p>
            <a href="foo" data-simplr-route>foo</a>
            <simplr-router-link route="foo" title="Foo"></simplr-router-link>
            <a href="foo/12" data-simplr-route>foo 12</a>
            <a href="foo/12/info" data-simplr-route>foo 12 info</a>
            <a href="baz" data-simplr-route>baz</a>
            <a href="https://www.google.com/webhp?ie=UTF-8&rct=j">Google</a>
            <p @click="${() => SimplrRouter.navigateToPath('foo/12')}">asd</p>

            <a href="foo/12" data-simplr-route><p>foo 12</p></a>
        `;
    }

    createRenderRoot() {
        return this;
    }
}

if (!customElements.get('simplr-frontpage')) {
    customElements.define('simplr-frontpage', SimplrFrontpage);
}
