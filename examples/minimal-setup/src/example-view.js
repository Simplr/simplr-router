import { LitElement, html } from "lit";
import { viewStyles } from "./view-styles.js";

const logo = new URL("../assets/open-wc-logo.svg", import.meta.url).href;

export class ExampleView extends LitElement {
    static get properties() {
        return {
            title: { type: String },
        };
    }

    static get styles() {
        return viewStyles;
    }

    constructor() {
        super();
        this.title = "Welcome to the example view";
    }

    render() {
        return html`
      <main>
        <div class="logo"><img alt="open-wc logo" src=${logo} /></div>
        <h1>${this.title}</h1>

        <ul>
          <li><a href="/">Go to the starting view</a></li>
          <li><a href="/example">Go to Example view</a></li>
          <li><a href="/dynamic/12">Go to Dynamic view with param 12</a></li>
          <li><a href="/dynamic/500">Go to Dynamic view with param 500</a></li>
        </ul>
      </main>
    `;
    }
}

customElements.define("example-view", ExampleView);
