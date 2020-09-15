import { h as e } from './0b10f69c.js';
import { V as r } from './acf6f4ee.js';
import './2b1f74ae.js';
let t,
    o = (e) => e;
class s extends r {
    static get styles() {
        return [super.styles];
    }
    render() {
        return e(
            t ||
                (t = o`<h2>Guards</h2> <p> Guards are for the cases where you want to limit access to a page, by for example a role check. </p> <p> An example of blocking the users page by using a guard to check for the user's ID. </p> <highlight-js lang="javascript" theme="gruvbox-dark"> import SimplrRouter from '@simplr-wc/router'; import './views/main-page.js'; import './views/user-profile.js'; import './views/user-root.js'; import './views/user-profile-edit.js'; import './views/forbidden-page.js'; const checkUserId = () => { // Do actual checking, for example with an API return false; }; const routes = [ { path: '/', component: 'main-page', }, { path: 'user', component: 'user-root', routes: [ { path: ':userId', component: 'user-profile', routes: [ { path: 'edit', component: 'user-profile-edit', guard: checkUserId, }, ], }, ], }, { path: 'forbidden', component: 'forbidden-page', }, ]; const router = new SimplrRouter({ routes, debugging: true }); router.init(); </highlight-js> <p> When a Guard is triggered, the router expects either a truthy or a falsy return value, and evaluates the guard on that. </p> <p> If no ForbiddenAction is set, the user will be displayed the "forbidden" -page, set in the router. If that route is not set, the user will be shown the "not-found" -page. </p> `)
        );
    }
}
customElements.get('router-docs-guards') || customElements.define('router-docs-guards', s);
export { s as RouterDocsGuard };
