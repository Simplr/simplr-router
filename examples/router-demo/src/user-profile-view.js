import { LitElement, html } from "lit";

export class UserProfileView extends LitElement {
    static get properties() {
        return {
            userId: { type: Number },
        };
    }

    render() {
        return html`
      <main>
        <p>This is the page of user ${this.userId}</p>
        <a href="/users">Go back</a>
      </main>
    `;
    }
}

customElements.define("user-profile-view", UserProfileView);
