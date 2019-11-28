import { LitElement, html } from 'lit-element';
import SimplrRouter from '../../lib/simplr-router';
import './views/simplr-router-link';
import routes from '../simplr-routes';
import SimplrFoo from './views/simplr-foo';
import { TransitionSpeed } from '../../lib/simplr-router-transition-speed';
import { TransitionDirection } from '../../lib/simplr-router-transition-direction';

class SimplrRouterIndex extends LitElement {
    static get properties() {
        return {};
    }

    constructor() {
        super();
    }

    firstUpdated(_changedProperties) {
        let router = new SimplrRouter({
            activeView: this,
            routes: routes,
            notFoundAction: () => {
                alert('Page not found');
            },
            forbiddenAction: () => {
                alert('Forbidden');
            },
            transitionSpeed: TransitionSpeed.FAST,
            transitionDirection: TransitionDirection.RIGHT,
            debugging: true,
            waitForLoad: true,
        });

        router.init();
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
            <p @click="${() => SimplrRouter.navigateToPath('foo/12')}">asd</p>
        `;
    }
}

customElements.define('simplr-router-index', SimplrRouterIndex);
