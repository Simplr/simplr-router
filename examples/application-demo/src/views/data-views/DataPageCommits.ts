import { html, LitElement } from "lit";
import { customElement } from "lit/decorators/custom-element.js";

@customElement("data-page-commits")
export class DataPageCommits extends LitElement {
    render() {
        return html`<p>Commits</p>`;
    }
}
