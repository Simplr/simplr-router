import SimplrRouter from './node_modules/simplr-router/simplr-router.js';

export default class SimplrRouterModule extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<div class="container"><p>Hello world</p></div>`;
        console.log('Connected');
    }
}

if (!customElements.get('simplr-router-module')) {
    customElements.define('simplr-router-module', SimplrRouterModule);
}
