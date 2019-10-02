import { LitElement, html } from "lit-element";

class ShadowPage extends LitElement {

    render() {
        return html`<a href="second-view" data-simplr-route>second-view</a>`;
    }
}

customElements.define("shadow-page", ShadowPage);