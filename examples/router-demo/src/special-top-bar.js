import { html, LitElement } from "lit";

export class SpecialTopBar extends LitElement {
    render() {
        return html`<nav><p>This is the special top bar</p></nav>`;
    }
}

customElements.define("special-top-bar", SpecialTopBar);
