import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators/custom-element.js";

@customElement("item-list")
export class ItemList extends LitElement {

    static get styles() {
        return css``;
    }

    render() {
        return html`
            <slot></slot>
        `
    }
}
