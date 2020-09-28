export default class IndexView extends HTMLElement {
    constructor() {
        super();

        const root = this.attachShadow({ mode: 'open' });
        root.innerHTML = `

        <slot name="top-bar"></slot>
        <p>Index view</p>
        <a href="/slot-route-demo/profile">To profile</a>
    `;
    }
}

if (!customElements.get('index-view')) {
    customElements.define('index-view', IndexView);
}
