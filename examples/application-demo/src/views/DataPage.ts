import { html, LitElement } from "lit";
import { customElement } from "lit/decorators/custom-element.js";

@customElement("data-page")
export class DataPage extends LitElement {

    render() {
        return html`<p>Data</p>`;
    }
}
