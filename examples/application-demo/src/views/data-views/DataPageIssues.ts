import { html, LitElement } from "lit";
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

    render() {
        return html` <ul>
			${this.issues.map(
            (iss) => html`
					<li>
						<h2>${iss.title}</h2>
						<p>${iss.body.substring(0, 50)}...</p>
					</li>
				`
        )}
		</ul>`;
    }
}
