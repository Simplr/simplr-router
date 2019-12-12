import SimplrRouter from './node_modules/simplr-router/simplr-router.js';
import routes from './routes.js';
import './views/homepage.js';
import './top-nav.js';

export default class SimplrRouterModule extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.initializeRouter();
    }

    initializeRouter() {
        let router = new SimplrRouter({
            activeView: document.querySelector('simplr-router-homepage'),
            routes: routes,
        });
        router.init();
    }
}

if (!customElements.get('simplr-router-module')) {
    customElements.define('simplr-router-module', SimplrRouterModule);
}
