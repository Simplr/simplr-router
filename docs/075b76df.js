import { h as e } from './0b10f69c.js';
import { V as s } from './acf6f4ee.js';
import './2b1f74ae.js';
let t,
    r = (e) => e;
class o extends s {
    static get styles() {
        return [super.styles];
    }
    render() {
        return e(
            t ||
                (t = r`<h2>Recipes</h2> <p> We've gathered a few quick-start recipes to get started quickly, and seeing some code examples of how to use Simplr Router </p> `)
        );
    }
}
customElements.get('router-docs-recipes') || customElements.define('router-docs-recipes', o);
export { o as RouterDocsRecipes };
