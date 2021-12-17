import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import "../components/ItemList";
import "../components/ItemListEntry";

@customElement("data-page")
export class DataPage extends LitElement {

    firstUpdated() {
        this._getRepositoryData();
    }

    async _getRepositoryData() {
        // Create a 3x1 grid with fields:
        // - Issues
        // - Pull Requests
        // - Commits
        //
        // ISSUES | PULL REQUESTS | COMMITS
        //
        // Under them, create a 2x1 grid, left side populates with a list of chosen category.
        // When clicked on a list item in the category, the right side populates with the data of the chosen item
    }

    render() {
        return html`
            <section class="categories">
                <a href="/data/issues">Issues</a>
                <a href="/data/pull-requests">Pull Requests</a>
                <a href="/data/commits">Commits</a>
            </section>
            <slot></slot>
        `;
    }

    static get styles() {
        return css`
            :host {
                display: flex;
                padding: 5rem 10rem;
                flex-direction: column;
            }

            section.categories {
                display: flex;
                width: 100%;
                justify-content: space-between;
            }

            section.categories a {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-basis: 25%;
                padding: 5rem 0;
                font-size: 26px;
                text-decoration: none;
                color: #2f2f2f;
                box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),0px 1px 8px 0px rgba(0, 0, 0, 0.12);
                border-radius: 4px;
            }

            section.categories a {
                background: #2f2f2f;
                color: #FFF;
                transition: 200ms ease-in-out;
            }

            section.categories a:hover,
            section.categories a[selected] {
                background: salmon;
                color: #2f2f2f;
            }
        `;
    }
}
