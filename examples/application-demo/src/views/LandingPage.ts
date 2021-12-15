import { html, LitElement } from "lit";
import { customElement } from "lit/decorators/custom-element.js";

@customElement("landing-page")
export class LandingPage extends LitElement {

    render() {
        return html`<p>Landing</p>`;
    }
}
