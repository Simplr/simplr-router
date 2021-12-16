import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators/custom-element.js";

@customElement("landing-page")
export class LandingPage extends LitElement {
    static get styles() {
        return css`
      main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
      }

      ul {
          text-align: center;
          list-style: none;
      }
      li {
          padding: 0.5rem 0;
      }
    `;
    }

    render() {
        return html`
      <main>
        <h1>Simplr Router Application Demo</h1>
        <h3>This demo consists of</h3>
        <ul>
          <li>The use of a router outlet to display content</li>
          <li>And external navigation component</li>
          <li>Page transitions</li>
          <li>Nested views</li>
          <li>Dynamic views</li>
          <li>And more!</li>
        </ul>
      </main>
    `;
    }
}
