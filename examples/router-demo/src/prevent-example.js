import { LitElement, html, css } from 'lit';
import { getBreadcrumbs } from "@simplr-wc/router";

const logo = new URL('../assets/open-wc-logo.svg', import.meta.url).href;

export class PreventExample extends LitElement {
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
        this.title = "This page will alert you as you're about to leave it";
    }

    renderBreadcrumbs() {
        const breadcrumbs = getBreadcrumbs();
        return html`${breadcrumbs.map(bc => html`<a href="${bc.path}">${bc.name}</a> / `)}`
    }

    render() {
        return html`
      <main>
        <div class="logo"><img alt="open-wc logo" src=${logo} /></div>
        <h1>${this.title}</h1>

        <a href="/param/11">Go to parametrized url</a>

        <p>You can find the application breadcrumbs below:</p>
        ${this.renderBreadcrumbs()}
    `;
    }
}

customElements.define("prevent-example", PreventExample);
