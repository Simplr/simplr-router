import { html, LitElement } from "lit";

export class ForbiddenView extends LitElement {

    render() {
        return html`<p>You do not have the authority to access this page</p>`
    }
}

customElements.define("forbidden-view", ForbiddenView);
