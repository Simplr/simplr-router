import { html, LitElement } from "lit";

export class NotFoundView extends LitElement {

    render() {
        return html`<p>The view you tried to access was not found</p>`
    }
}

customElements.define("not-found-view", NotFoundView);
