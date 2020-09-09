import { html } from 'lit-element';
import { ViewTemplate } from './view-template.js';

export class RouterDocsApiDescription extends ViewTemplate {
    static get styles() {
        return [super.styles];
    }

    render() {
        return html` <h2>API description</h2> `;
    }
}

if (!customElements.get('router-docs-api-description')) {
    customElements.define(
        'router-docs-api-description',
        RouterDocsApiDescription
    );
}
