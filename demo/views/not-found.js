export default class NotFoundView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = 'Not found';
    }
}

if (!customElements.get('not-found-page')) {
    customElements.define('not-found-page', NotFoundView);
}
