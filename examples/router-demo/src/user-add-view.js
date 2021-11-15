import { LitElement, html } from "lit";

export class UserAddView extends LitElement {
    static get properties() {
        return {
            userId: { type: Number },
        };
    }

    render() {
        return html`
      <main>
        <p>You can't add any more users at the moment</p>
        <a href="/users">Go back</a>
      </main>
    `;
    }
}

customElements.define("user-add-view", UserAddView);
