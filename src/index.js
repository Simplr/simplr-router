import { LitElement, html } from 'lit-element';
import SimplrRouter from "../lib/simplr-router";
import {TransitionDirection} from "../lib/simplr-router-transition-direction";
import {TransitionSpeed} from "../lib/simplr-router-transition-speed";
import "./views/simplr-router-link";
import routes from "../simplr-routes";

class SimplrRouterIndex extends LitElement {
    static get properties() {
        return {

        };
    }

    constructor() {
        super();
    }

    firstUpdated(_changedProperties) {
        SimplrRouter.init(this, routes);
    }

    createRenderRoot() {
        return this;
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
        `;
    }

}

customElements.define("simplr-router-index", SimplrRouterIndex);