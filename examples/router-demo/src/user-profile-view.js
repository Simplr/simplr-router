import { LitElement, html } from "lit";

export class UserProfileView extends LitElement {
    static get properties() {
        return {
            userId: { type: Number },
        };
    }

    render() {
        return html`
      <main style="border: 2px solid red; display: flex;">
          <div>
        <p>This is the page of user ${this.userId}</p>
        <a href="/users/${this.userId}/edit">Edit</a>
        <a href="/users">Go back</a>
          </div>
        <div style="border: 2px solid green;"
            <h3>And the second here</h3>
        <slot></slot>
        </div>
      </main>
    `;
    }
}

customElements.define("user-profile-view", UserProfileView);
