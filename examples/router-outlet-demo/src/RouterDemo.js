import { LitElement, html, css } from "lit";

const logo = new URL("../assets/open-wc-logo.svg", import.meta.url).href;

export class RouterDemo extends LitElement {
    static get properties() {
        return {
            title: { type: String },
        };
    }

    static get styles() {
        return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: #1a2b42;
        max-width: 960px;
        margin: 0 auto;
        text-align: center;
        background-color: var(--router-demo-background-color);
      }

      simplr-router-container {
        background: transparent;
        opacity: 1;
      }

      simplr-router-container[leaving-view],
      simplr-router-container[entering-view] {
        background: transparent;
        opacity: 0;
      }

      main {
        flex-grow: 1;
        height: 100vh;
        width: 100%;
      }

      .logo {
        margin-top: 36px;
        animation: app-logo-spin infinite 20s linear;
      }

      @keyframes app-logo-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .app-footer {
        font-size: calc(12px + 0.5vmin);
        align-items: center;
      }

      .app-footer a {
        margin-left: 5px;
      }
    `;
    }

    constructor() {
        super();
        this.title = "My app";
    }

    render() {
        return html`
      <main>
        <div class="logo"><img alt="open-wc logo" src=${logo} /></div>
        <simplr-router-outlet></simplr-router-outlet>
      </main>
    `;
    }
}
