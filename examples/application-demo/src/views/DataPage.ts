import { html, LitElement } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { getRepositoryData } from "../service/GitHub";

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
        const repositories = await getRepositoryData();
        console.log(repositories);
    }

    render() {
        return html`<p>Data</p>`;
    }
}
