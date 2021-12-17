import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { getIssue } from "../../service/GitHub";

@customElement("data-page-pull-request-panel")
export class DataPagePullRequestPanel extends LitElement {
    @property({ type: Number })
    prNumber: number = 0;

    @property({ type: Object })
    pullRequest: any | undefined;

    firstUpdated() {
        this._getPullRequestData();
    }

    private async _getPullRequestData() {
        if (!this.prNumber) return;

        this.pullRequest = await getIssue(this.prNumber);
    }

    render() {
        if (!this.pullRequest) return html``;

        return html`
			<h2>${this.pullRequest.title}</h2>
			<p>${this.pullRequest.body}</p>

			<p>Created: ${this.pullRequest.created_at}</p>
			<p>Last updated: ${this.pullRequest.updated_at}</p>

			<a target="_blank" href="${this.pullRequest.html_url}">Link to pull request</a>
		`;
    }

    static get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: column;
            }
        `
    }
}
