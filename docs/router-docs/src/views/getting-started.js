import { html } from 'lit-element';
import { ViewTemplate } from './view-template.js';
import 'highlight-js-wc';

export class RouterDocsGettingStarted extends ViewTemplate {
    static get styles() {
        return [super.styles];
    }

    render() {
        return html`<h2>Getting started</h2>
            <p>
                Getting started with Simplr Router is easy and requires little
                to no setup for a PoC to get off the ground.
            </p>
            <!-- prettier-ignore -->
            <highlight-js lang="javascript" theme="gruvbox-dark">
    import SimplrRouter from '@simplr-wc/router';
    import './views/root-view.js';
    import './views/getting-started.js';
    import './views/api-description.js';

    const appRoutes = [
      {
        path: '/',
        component: 'router-docs-root',
      },
      {
        path: '/getting-started',
        component: 'router-docs-getting-started',
      },
      {
        path: '/api-description',
        component: 'router-docs-api-description',
      },
    ];

    export default class RouterRoot extends HTMLElement {
      connectedCallback() {
        const options = {
          routes: appRoutes,
        };

        const router = new SimplrRouter(options);
        router.init();
      }
    }

    customElements.define('router-root', RouterRoot);

            </highlight-js>

            <p>
                In the above example, we create a router Web Component, which
                takes care of all of our routing needs.
            </p>
            <p>
                By no means is this the only way you can set up the router. In
                fact the use of a Web Component for setup is not necessary.
            </p>
            <p>
                You could just call the above code in the startup of your web
                app or at any step, and get the same results.
            </p>

            <h3>Changing views</h3>

            <p><b>Initial view</b></p>
            <p>
                After calling the <code>router.init();</code> the Simplr
                Router's routing kicks in, loading the view of the currently
                open url. The router also adds listeners to all of the anchor
                elements on page, automating the routing of all in-app links.
            </p>

            <p>
                If we were for example at
                <code>http://localhost:8000/</code> the router would load the
                component "router-docs-root" into the view.
            </p>

            <p><b>Consequent views</b></p>

            <p>
                After the initialization, all of the anchor links on the page
                will be listened for clicks, and if the
                <code>href</code>-attribute of the link points to a route
                specified in the routes of Simplr Router, the view will be
                loaded and transitioned into without a page load.
            </p>

            <!-- prettier-ignore -->
            <highlight-js lang="html" theme="gruvbox-dark">
        <!-- Navigates using the Simplr Router without a page load -->
        <a href="/getting-started">Getting started</a>

        <!-- Navigates to the Twitter home page like normal anchor links would -->
        <a href="https://twitter.com/">Twitter</a>
            </highlight-js>

            <p>
                No extra setup is needed to enable Simplr Router meaning you can
                apply the router to an existing project to create a more SPA
                experience.
            </p> `;
    }
}

if (!customElements.get('router-docs-getting-started')) {
    customElements.define(
        'router-docs-getting-started',
        RouterDocsGettingStarted
    );
}
