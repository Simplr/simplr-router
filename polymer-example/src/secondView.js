import { LitElement, html } from "@polymer/lit-element";

class SecondView extends LitElement {

    render() {
        return html`<p>Second view</p>`;
    }
}

customElements.define("second-view", SecondView);