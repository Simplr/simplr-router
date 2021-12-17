import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { getIssue } from "../../service/GitHub";

@customElement("data-page-issue-panel")
export class DataPageIssuePanel extends LitElement {
    @property({ type: Number })
    issueNumber: number = 0;

    @property({ type: Object })
    issue: any | undefined;

    firstUpdated() {
        this._getIssueData();
    }

    private async _getIssueData() {
        if (!this.issueNumber) return;

        this.issue = await getIssue(this.issueNumber);
    }

    render() {
        if (!this.issue) return html``;

        return html`
			<h2>${this.issue.title}</h2>
			<p>${this.issue.body}</p>

			<p>Created: ${this.issue.created_at}</p>
			<p>Last updated: ${this.issue.updated_at}</p>

			<a target="_blank" href="${this.issue.html_url}">Link to issue</a>
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
