export default class ProfileView extends HTMLElement {
    constructor() {
        super();

        const root = this.attachShadow({ mode: 'open' });
        root.innerHTML = `

<style>
::slotted(profile-top-bar) {
    position: fixed;
    top: 0;
    left: 0;
    background: red;
    width: 100%;
    height: 55px;
}

    :host {
        margin-top: 70px;
        display: block;
    }

    ::slotted(profile-side-bar) {
        position: fixed;
        top: 0;
        right: 0;
        width: 200px;
        height: 100vh;
        display: block;
        background: blue;
    }
</style>

        <slot name="top-bar"></slot>

        <p>This is a profile view</p>
        <slot name="profile-sidebar"></slot>
    `;
    }
}

if (!customElements.get('profile-view')) {
    customElements.define('profile-view', ProfileView);
}
