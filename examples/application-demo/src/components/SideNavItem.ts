import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";

@customElement("side-nav-item")
export class SideNavItem extends LitElement {
    @property({ type: String, reflect: true })
    href: string = "";

    @property({ type: String, reflect: true })
    label: string = "";

    @property({ type: Boolean, reflect: true })
    external: boolean = false;

    static get styles() {
        return css`
      :host {
        color: #fff;
        font-size: 1.6rem;
        background: inherit;
        cursor: pointer;
        transition: 200ms ease-in-out;
        display: flex;
      }

      :host(:hover) {
        background: salmon;
        color: #2f2f2f;
      }

      a {
          width: 100%;
        padding: 1rem 2rem;
        color: inherit;
        text-decoration: none;
      }
    `;
    }

    render() {
        return html`<a href="${this.href}">${this.label}${this.external ? html`&#x2607;` : ''}</a>`;
    }
}
