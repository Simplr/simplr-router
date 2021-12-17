import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators/custom-element.js";

@customElement("data-page-info")
export class DataPageInfo extends LitElement {

    render() {
        return html`
            <p>This is the data page. On this page you can browse data about the Simplr Router project, provided by the GitHub API</p>
            <p>The routing handles different child views inside this view, and displays the needed parts dynamically</p>
            <p>This content is loaded as a slotted element of the above view, and will dynamically change when you navigate with the buttons above</p>
        `
    }

    static get styles() {
        return css`
            :host {
                padding-top: 4rem;
            }
        `
    }
}
