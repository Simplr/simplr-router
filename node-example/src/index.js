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
            stackedViews: true,
        });

        router.init();
    }

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <simplr-frontpage></simplr-frontpage>
            <div class="ball-holder">
                <div class="ball"></div>
            </div>
            <div
                style="height: 10px; width: ${window.innerWidth}px; background: black"
            ></div>
        `;
    }
}

customElements.define('simplr-router-index', SimplrRouterIndex);
