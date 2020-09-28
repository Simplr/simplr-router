export default class ProfileSideBar extends HTMLElement {
    constructor() {
        super();

        const root = this.attachShadow({ mode: 'open' });

        root.innerHTML = `
        <p>This is the profile side bar</p>
    `;
    }
}

if (!customElements.get('profile-side-bar')) {
    customElements.define('profile-side-bar', ProfileSideBar);
}
