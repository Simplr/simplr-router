
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators/custom-element.js";

@customElement("about-page")
export class AboutPage extends LitElement {

    render() {
        return html`<p>About</p>`;
    }
}
