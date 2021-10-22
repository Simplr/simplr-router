import { html, LitElement } from "lit";

export class RegularTopBar extends LitElement {
    render() {
        return html`<nav><p>This is the regular top bar</p></nav>`;
    }
}

customElements.define("regular-top-bar", RegularTopBar);
