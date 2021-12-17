import { html, LitElement } from "lit";
import { customElement } from "lit/decorators/custom-element.js";

@customElement("data-page-pull-requests")
export class DataPagePullRequests extends LitElement {
    render() {
        return html`<p>Pull requests</p>`;
    }
}
