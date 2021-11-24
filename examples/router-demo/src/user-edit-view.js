import { LitElement, html } from "lit";

export class UserEditView extends LitElement {
    static get properties() {
        return {
            userId: { type: Number },
        };
    }

    render() {
        return html`
      <main style="border: 2px solid #000">
        <p>Editing users is not permitted at the moment</p>
      </main>
    `;
    }
}

customElements.define("user-edit-view", UserEditView);
