import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { getPullRequests } from "../../service/GitHub";

@customElement("data-page-pull-requests")
export class DataPagePullRequests extends LitElement {
    @property({ type: Object })
    pullRequests: Array<any> = [];

    firstUpdated() {
        this._fetchpullRequests();
    }

    private async _fetchpullRequests() {
        this.pullRequests = await getPullRequests();
    }

    _createPrUrl(pr: any) {
        return "/data/pull-requests/" + pr.number;
    }

    render() {
        return html`
			<section>
                ${this.pullRequests.length <= 0 ? html`<p>No pull-requests found</p>` : ''}
				<item-list>
					${this.pullRequests.map(
            (pr) => html`
							<item-list-entry
								.title=${pr.title}
								.content=${pr.body ?? ''}
								.href=${this._createPrUrl(pr)}
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
