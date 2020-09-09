import { html } from 'lit-element';
import { ViewTemplate } from './view-template.js';

export class RouterDocsRoot extends ViewTemplate {
    static get styles() {
        return [super.styles];
    }

    render() {
        return html`
            <h2>Simplr Router</h2>

            <p>
                Simplr Router is a easy to use, easy to setup Router for Web
                Components.
            </p>
            <p>
                Simplr Router creates seamless transitions between views, and
                created smooth user experiences.
            </p>
            <p>Simplr Router ships with 0 dependencies.</p>
        `;
    }
}

if (!customElements.get('router-docs-root')) {
    customElements.define('router-docs-root', RouterDocsRoot);
}
