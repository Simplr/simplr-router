import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { getCommit } from "../../service/GitHub";

@customElement("data-page-commit-panel")
export class DataPageCommitPanel extends LitElement {
    @property({ type: String })
    commitSha: string = "";

    @property({ type: Object })
    commit: any | undefined;

    firstUpdated() {
        this._getCommitData();
    }

    private async _getCommitData() {
        if (!this.commitSha) return;

        this.commit = await getCommit(this.commitSha);
    }

    render() {
        if (!this.commit) return html``;

        return html`
			<h2>${this.commit.sha}</h2>
			<p>${this.commit.commit.message}</p>

			<p>Created: ${this.commit.commit.committer.date}</p>

			<ul>
				${this.commit.files.map(
            (file: any) => html`
						<li>
							<span>${file.filename}</span>
							<ins>+${file.additions}</ins>
							<del>-${file.deletions}</del>
						</li>
					`
        )}
			</ul>

			<a target="_blank" href="${this.commit.html_url}">Link to issue</a>
		`;
    }

    static get styles() {
        return css`
        ul {
            list-style: none;
        }

        li {
            margin-bottom: 0.4rem;
        }

        ins {
            color: green;
        }

        del {
            text-decoration: none;
            color: red;
        }

        `
    }
}
