import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { getIssues } from "../../service/GitHub";

@customElement("data-page-issues")
export class DataPageIssues extends LitElement {
    @property({ type: Object })
    issues: Array<any> = [];

    firstUpdated() {
        this._fetchIssues();
    }

    private async _fetchIssues() {
        this.issues = await getIssues();
    }

    _createIssueUrl(issue: any) {
        return "/data/issues/" + issue.number;
    }

    render() {
        return html`
			<section class="listing">
				<item-list>
					${this.issues.map(
            (iss) => html`
							<item-list-entry
								.title=${iss.title}
								.content=${iss.body}
								.href=${this._createIssueUrl(iss)}
							></item-list-entry>
						`
        )}
				</item-list>
			</section>
            <section class="issue-panel">
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
			}
		`;
    }
}
