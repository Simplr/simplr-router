import { LitElement, html } from "lit";

export class UsersListView extends LitElement {
    render() {
        return html`
      <main>
        <h1>Users list</h1>
        <ul>
            <li><a href="users/1">User #1</a></li>
            <li><a href="users/2">User #2</a></li>
            <li><a href="users/3">User #3</a></li>
        </ul>

        <a href="users/new">Add new user</a>
      </main>
    `;
    }
}

customElements.define("users-list-view", UsersListView);
