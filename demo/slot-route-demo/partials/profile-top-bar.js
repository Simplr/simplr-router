export default class ProfileTopBar extends HTMLElement {
    constructor() {
        super();

        const root = this.attachShadow({ mode: 'open' });

        root.innerHTML = `
        <p>This is the profile view top bar</p>
    `;
    }
}

if (!customElements.get('profile-top-bar')) {
    customElements.define('profile-top-bar', ProfileTopBar);
}
