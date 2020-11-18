import { html } from 'lit-element';
import { ViewTemplate } from './view-template.js';
import 'highlight-js-wc';

export class RouterDocsMiddleware extends ViewTemplate {
    static get styles() {
        return [super.styles];
    }

    render() {
        return html`<h2>Middleware</h2>

            <p>
                Simplr Router supports middleware to enhance the base
                functionality of the Router.
            </p>

            <p>
                A middleware can be easily plugged into the router and used
                across the project.
            </p>

            <p>
                A middleware instance can implement one or all of the middleware
                functions exposed by the router. The functions are as follows:
            </p>

            <table>
                <tr>
                    <th>Method</th>
                    <th>Type</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td>routerNavigating</td>
                    <td>
                        Consumes: <code>viewObject</code> <br />Produces:
                        <code>viewObject</code>
                    </td>
                    <td>
                        routerNavigating is called after the router has resolved
                        the route it needs to navigate to. The viewObject will
                        contains data about the route, if one was found.
                        <br /><br />
                        This function can be used to apply additional checks to
                        the routes, or for manipulating the route data before
                        navigation actually happens.
                        <br /><br />
                        Another use-case could be for example Logging
                    </td>
                </tr>
                <tr>
                    <td>routerNavigationComplete</td>
                    <td>
                        Consumes: <code>container</code><br />Produces:
                        <code>Nothing</code>
                    </td>
                    <td>
                        routerNavigationComplete is called after the navigation
                        has finished.<br /><br />This middleware hook could be
                        used to apply additional effects to views after
                        navigation has fully completed.
                    </td>
                </tr>
                <tr>
                    <td>newViewAddedToDOM</td>
                    <td>
                        Consumes: <code>container</code><br />Produces:
                        <code>Nothing</code>
                    </td>
                    <td>
                        newViewAddedToDOM is called as soon as the new view
                        element has hit the DOM, and is accessible by
                        javascript.<br /><br />This middleware hook could be
                        used to apply some additional effects as soon as
                        possible, even before the whole transition animation has
                        finished.
                    </td>
                </tr>
            </table>

            <p>
                The Above functions are used to react to events administrated by
                Simplr Router. The functions below are used to override the
                default behavior of Simplr Router.
            </p>
            <table>
                <tr>
                    <th>Method</th>
                    <th>Type</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td>addViewToContainerOverride</td>
                    <td>
                        Consumes: <code>container, viewObject</code><br />
                        Produces: <code>Nothing</code>
                    </td>
                    <td>
                        addViewToContainerOverride overwrites the functionality
                        Simplr Router has for appending a new View component
                        into the Simplr Router Container.
                        <br /><br />
                        If this function is defined in a middleware, it
                        overrides the default functionality with the new one.
                        <br /><br />
                        The default implementation can be found
                        <a
                            target="_blank"
                            href="https://github.com/Simplr/simplr-router/blob/master/lib/modules/router.js#L87"
                            >here</a
                        >
                        <br /><br />
                        A use case for overriding the existing implementation
                        could be for example support for a different javascript
                        framework.
                        <br />
                        <br />
                        An example on this can be found from the
                        <a
                            target="_blank"
                            href="https://github.com/Simplr/simplr-router-react-middleware/blob/main/react-middleware.js#L5"
                            >official React Middleware implementation</a
                        >
                    </td>
                </tr>
                <tr>
                    <td>createComponentOverride</td>
                    <td>Consumes: view<br />Produces: component</td>
                    <td>
                        createComponentOverride overwrites the functionality
                        Simplr Router has for creating the View Component before
                        appending it into the Simplr Router Container.
                        <br /><br />
                        Some frameworks might have a different way of creating a
                        fresh component from the
                        <a
                            target="_blank"
                            href="https://github.com/Simplr/simplr-router/blob/master/lib/modules/builder.js#L2"
                            >default implementation</a
                        >
                        of Simplr Router. In these cases it's worth
                        consideration to overwrite this function to impelment a
                        custom builder for the view component. <br /><br />
                        The default functionality uses the
                        <code>document.createElement()</code>-function to create
                        the view, so if a different method is needed, this
                        function can do that.
                        <br />
                        <br />
                        An example on this can be found from the
                        <a
                            target="_blank"
                            href="https://github.com/Simplr/simplr-router-react-middleware/blob/main/react-middleware.js#L9"
                            >official React Middleware implementation</a
                        >
                    </td>
                </tr>
            </table>

            <p>
                Plugging in a middleware into Simplr Router can be done with the
                <code>use()</code>-function
            </p>
            <!-- prettier-ignore -->
            <highlight-js lang="javascript" theme="gruvbox-dark">
    import SimplrRouter from "@simplr-wc/router";
    import MyMiddleware from "./middleware.js";

    const router = new SimplrRouter({routes});
    router.use(MyMiddleware);
    router.init();
            </highlight-js>

            <p>
                A middleware that implements all of the functions would be as
                follows:
            </p>
            <!-- prettier-ignore -->
            <highlight-js lang="javascript" theme="gruvbox-dark">
    export default class SimplrRouterMiddleware {
        routerNavigating(viewObject) {
            console.log("Navigating to view", viewObject);
            return viewObject;
        }

        routerNavigationComplete(container) {
            console.log("Navigation complete. New container around the new view is ", container); 
        }

        newViewAddedToDOM(container) {
            console.log("Container containing the new view was added to the DOM", container);
        }

        addViewToContainerOverride(container, viewObject) {
            // This is actually the default configuration, but I'm overwriting it anyway
            container.appendChild(viewObject);
        }

        // This Overwrite example is from the React implementation
        createComponentOverride(view) {
            if (view.import) {
              await view.import();
            }
            return React.createElement(view.component, view.params, null);
        }
    }
            </highlight-js> `;
    }
}

if (!customElements.get('router-docs-middleware')) {
    customElements.define('router-docs-middleware', RouterDocsMiddleware);
}
