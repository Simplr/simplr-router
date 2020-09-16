import { h as html } from './navigation-drawer-fba396a4.js';
import { V as ViewTemplate } from './view-template-7b5f94a1.js';
import './highlight-js-wc-a7f1f169.js';

class RouterDocsRecipes extends ViewTemplate {
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

export { RouterDocsRecipes };
