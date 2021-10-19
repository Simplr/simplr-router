import { LitElement, html, css } from 'lit';

export class RouterFrontpage extends LitElement {
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

      main {
        flex-grow: 1;
      }

      .logo {
        margin-top: 36px;
        animation: app-logo-spin infinite 20s linear;
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
        this.title = 'My app';
    }

    render() {
        return html`
      <main>
        <h1>${this.title}</h1>

        <a href="example">Go to example url</a>

        <p>You can find the application breadcrumbs below:</p>
      </main>
    `;
    }
}

customElements.define("router-frontpage", RouterFrontpage);
