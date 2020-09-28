export default class TopBar extends HTMLElement {
    constructor() {
        super();

        const root = this.attachShadow({ mode: 'open' });

        root.innerHTML = `
        <p>This is the index view top bar</p>
    `;
    }
}

if (!customElements.get('default-topbar')) {
    customElements.define('default-topbar', TopBar);
}
