import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { getCommits } from "../../service/GitHub";

@customElement("data-page-commits")
export class DataPageCommits extends LitElement {
    @property({ type: Object })
    commits: Array<any> = [];

    firstUpdated() {
        this._fetchCommits();
    }

    private async _fetchCommits() {
        this.commits = await getCommits();
    }

    _createCommitUrl(commit: any) {
        return "/data/commits/" + commit.sha;
    }

    render() {
        return html`
			<section>
                ${this.commits.length <= 0 ? html`<p>No commits found</p>` : ''}
				<item-list>
					${this.commits.map(
            (comm) => html`
							<item-list-entry
								.title=${comm.commit.message}
								.content=${comm.sha}
								.href=${this._createCommitUrl(comm)}
							></item-list-entry>
						`
        )}
				</item-list>
			</section>
			<section>
				<slot></slot>
			</section>
		`;
    }

    static get styles() {
        return css`
			:host {
				margin: 4rem 0 0;
				display: flex;
				justify-content: space-between;
			}

			section {
				flex-basis: 40%;
                max-height: 600px;
                overflow-y: auto;
			}
		`;
    }
}
