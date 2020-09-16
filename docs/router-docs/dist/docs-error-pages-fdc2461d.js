import { h as html } from './navigation-drawer-f3c0d088.js';
import { V as ViewTemplate } from './view-template-205ce822.js';
import './highlight-js-wc-a7f1f169.js';

class RouterDocsErrorPages extends ViewTemplate {
    static get styles() {
        return [super.styles];
    }

    render() {
        return html`<h2>Error pages</h2>

            <p>
                Simplr Router supports two kinds of error pages: "Not Found" and
                "Forbidden" -pages.
            </p>

            <p>
                The error pages can be handled in 2 ways: via a function, or by
                assigning a route
            </p>

            <p><b>Assigning a route</b></p>

            <p>
                You can easily assign a route and a view to display if the user
                navigates to a page that does not exist. This can be done by
                creating a route with the path name <code>not-found</code>
            </p>

            <!-- prettier-ignore -->
            <highlight-js lang="javascript" theme="gruvbox-dark">
    import SimplrRouter from '@simplr-wc/router';
    import './views/main-page.js';
    import './views/not-found-page.js';


    const routes = [
        {
            path: '/',
            component: 'main-page',
        },
        {
            path: 'not-found',
            component: 'not-found-page',
        },
    ];

    const router = new SimplrRouter({ routes });
    router.init();
     
            </highlight-js>

            <p>
                A Forbidden -page can be created the same way. A Forbidden page
                is triggered when a <a href="/recipes/guards">guard</a> fails
            </p>

            <!-- prettier-ignore -->
            <highlight-js lang="javascript" theme="gruvbox-dark">
    import SimplrRouter from '@simplr-wc/router';
    import './views/main-page.js';
    import './views/forbidden-page.js';

    const verifyUser = () => {
        // Actually do a check and return the return value
        return true;
    }

    const routes = [
        {
            path: '/',
            component: 'main-page',
        },
        {
            path: '/secret-site',
            component: 'secret-site',
            guard: verifyUser
        }
        {
            path: 'forbidden',
            component: 'forbidden-page',
        },
    ];

    const router = new SimplrRouter({ routes });
    router.init();
     
            </highlight-js>

            <p><b>By Action</b></p>

            <p>
                The other way of handling these error pages is via a function
                given in the initialization of the router.
            </p>
            <p>
                This action can be for example a call to the API, informing that
                a unsuccessful verification was made.
            </p>

            <!-- prettier-ignore -->
            <highlight-js lang="javascript" theme="gruvbox-dark">
    import SimplrRouter from '@simplr-wc/router';
    import './views/main-page.js';
    import './views/forbidden-page.js';

    const verifyUser = () => {
        // Do actual checking, for example with an API
        return false;
    };

    const routes = [
        {
            path: '/',
            component: 'main-page',
        },
        {
            path: '/secret-site',
            component: 'secret-site',
            guard: verifyUser
        }
    ];

    const router = new SimplrRouter({
        routes,
        debugging: true,
        notFoundAction: () => {
            // Send a message to server about this event
            console.log('Not found page hit');
        },
        forbiddenAction: () => {
            // Send them to google because reasons
            window.location.href = 'https://google.com';
        },
    });
    router.init();
     
            </highlight-js> `;
    }
}

if (!customElements.get('router-docs-error-pages')) {
    customElements.define('router-docs-error-pages', RouterDocsErrorPages);
}

export { RouterDocsErrorPages };
