import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";

@customElement("item-list-entry")
export class ItemListEntry extends LitElement {
    @property({ type: String })
    href: string = "";
    @property({ type: String })
    title: string = "";
    @property({ type: String })
    content: string = "";

    static get styles() {
        return css`
			:host {
				display: flex;
				border: 1px solid #4f4f4f;
                margin-bottom: 1rem;
                font-size: 0.8rem;
                transition: 200ms ease-in-out;
			}

                :host(:hover) {
                    background: salmon;
                }

			a {
				padding: 0.5rem 1rem;
				color: inherit;
				text-decoration: none;
			}
		`;
    }

    render() {
        return html`
			<a href="${this.href}">
				<h2>${this.title}</h2>
				<p>${this.content.substring(0, 200)}...</p>
			</a>
		`;
    }
}
