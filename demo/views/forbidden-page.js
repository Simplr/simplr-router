export default class ForbiddenView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = 'Forbidden';
    }
}

if (!customElements.get('forbidden-page')) {
    customElements.define('forbidden-page', ForbiddenView);
}
