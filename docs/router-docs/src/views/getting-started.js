import { html } from 'lit-element';
import { ViewTemplate } from './view-template.js';

export class RouterDocsGettingStarted extends ViewTemplate {
    static get styles() {
        return [super.styles];
    }

    render() {
        return html` <h2>Getting started</h2> `;
    }
}

if (!customElements.get('router-docs-getting-started')) {
    customElements.define(
        'router-docs-getting-started',
        RouterDocsGettingStarted
    );
}
