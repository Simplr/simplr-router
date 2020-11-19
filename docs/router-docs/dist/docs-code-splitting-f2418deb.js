import { h as html } from './navigation-drawer-aa6af123.js';
import { V as ViewTemplate } from './view-template-f58507f7.js';
import './highlight-js-wc-a7f1f169.js';

class RouterDocsCodeSplitting extends ViewTemplate {
    static get styles() {
        return [super.styles];
    }

    render() {
        return html`<h2>Code splitting</h2>

            <p>
                Simplr Router supports code splitting, allowing you to ship your
                modules' code when they're actually needed.
            </p>

            <p>
                Using code splitting is useful in larger projects, where there
                are multiple views, that might not be accessed on a normal
                browsing session.
            </p>

            <p>
                To enable code splitting, just add a
                <code>import</code>-property to your routes.
            </p>
            <!-- prettier-ignore -->
            <highlight-js lang="javascript" theme="gruvbox-dark">

    const routes = [
        {
            path: '',
            component: 'router-docs-root',
            import: () => import('./views/root-view.js'),
        },
        {
            path: 'getting-started',
            component: 'router-docs-getting-started',
            import: () => import('./views/getting-started.js'),
        },
        {
            path: 'api-description',
            component: 'router-docs-api-description',
            import: () => import('./views/api-description.js'),
        },
        {
            path: 'recipes',
            component: 'router-docs-recipes',
            import: () => import('./views/docs-recipes.js'),
            routes: [
                {
                    path: 'sub-routes',
                    component: 'router-docs-sub-routes',
                    import: () => import('./views/docs-sub-routes.js'),
                },
                {
                    path: 'guards',
                    component: 'router-docs-guards',
                    import: () => import('./views/docs-guard.js'),
                },
                {
                    path: 'error-pages',
                    component: 'router-docs-error-pages',
                    import: () => import('./views/docs-error-pages.js'),
                },
                {
                    path: 'code-splitting',
                    component: 'router-docs-code-splitting',
                    import: () => import('./views/docs-code-splitting.js'),
                },
            ],
        },
    ];

    export default routes;
            </highlight-js>

            <p>
                The views will then be imported as the navigation event is
                fired, making the initial package size of your application a lot
                smaller.
            </p> `;
    }
}

if (!customElements.get('router-docs-code-splitting')) {
    customElements.define(
        'router-docs-code-splitting',
        RouterDocsCodeSplitting
    );
}

export { RouterDocsCodeSplitting };
