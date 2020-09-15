import { html } from 'lit-element';
import { ViewTemplate } from './view-template.js';
import 'highlight-js-wc';

export class RouterDocsRecipes extends ViewTemplate {
    static get styles() {
        return [super.styles];
    }

    render() {
        return html`<h2>Recipes</h2>

            <p>
                We've gathered a few quick-start recipes to get started quickly,
                and seeing some code examples of how to use Simplr Router
            </p> `;
    }
}

if (!customElements.get('router-docs-recipes')) {
    customElements.define('router-docs-recipes', RouterDocsRecipes);
}
