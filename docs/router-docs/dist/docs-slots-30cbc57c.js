import { h as html } from './navigation-drawer-84870dea.js';
import { V as ViewTemplate } from './view-template-182f42f1.js';
import './highlight-js-wc-a7f1f169.js';

class RouterDocsSlots extends ViewTemplate {
    static get styles() {
        return [super.styles];
    }

    render() {
        return html`<h2>Slots</h2>

            <p>
                Simplr Router allows you to define slots to be appended to the
                view while the view is loaded to DOM.
            </p>

            <p>
                This allows creating views with dynamic slotted elements
                depending on the route the user accessed the view from.
            </p>

            <p>
                To add a slot to the view, you just add an array of Slot
                Elements to the wanted route object.
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
            path: 'user-page',
            component: 'user-page',
            import: () => import('./views/user-page.js'),
            slots: [
                {
                    'top-bar': 'default-topbar',
                    import: () => import('./partials/top-bar.js'),
                },
            ],
        },
        {
            path: 'admin-user-page',
            component: 'user-page',
            import: () => import('./views/user-page.js'),
            slots: [
                {
                    'top-bar': 'admin-topbar',
                    import: () => import('./partials/admin-top-bar.js'),
                },
            ],
        },
    ];

    export default routes;
            </highlight-js>

            <p>
                This example would result in the views in the DOM being shown as
                follows:
            </p>

            <!-- prettier-ignore -->
            <highlight-js lang="html" theme="gruvbox-dark">
    <!-- user-page --> 
    <user-page>
        <default-topbar slot="top-bar"></default-topbar>
    </user-page>

    <!-- admin-user-page --> 
    <admin-user-page>
        <admin-topbar slot="top-bar"></admin-topbar>
    </admin-user-page>
            </highlight-js> `;
    }
}

if (!customElements.get('router-docs-slot')) {
    customElements.define('router-docs-slots', RouterDocsSlots);
}

export { RouterDocsSlots };
