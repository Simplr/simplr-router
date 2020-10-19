import { html } from 'lit-element';
import { ViewTemplate } from './view-template.js';

export class RouterDocsApiDescription extends ViewTemplate {
    static get styles() {
        return [super.styles];
    }

    render() {
        return html`
            <h2>API description</h2>

            <p><b>SimplrRouter</b></p>

            <table>
                <tr>
                    <th>Method</th>
                    <th>Type</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td>new SimplrRouter()</td>
                    <td>
                        (options: <code>SimplrRouterOptions</code>) :
                        SimplrRouter
                    </td>
                    <td>
                        The Constructor method of Simplr Router. Takes the
                        <code>SimplrRouterOptions</code> object as a parameter.
                    </td>
                </tr>
                <tr>
                    <td>init()</td>
                    <td>() : void</td>
                    <td>
                        The initializer method of Simplr Router. No routing
                        action will be done before this is called. Loads up the
                        current url's view during initialization.
                    </td>
                </tr>
                <tr>
                    <td>changeView()</td>
                    <td>(viewName) : void</td>
                    <td>
                        A helper function to navigate to a new view
                        programmatically. Takes the path of the view as a
                        parameter. The format of the view should be the same as
                        it would be in a <code>a</code> -anchor tag
                    </td>
                </tr>
                <tr>
                    <td>getBreadcrumbs()</td>
                    <td>(): void</td>
                    <td>
                        Get an array of breadcrumb objects. Breadcrumbs are
                        created when parsing the routes from the JSON structure.
                    </td>
                </tr>
            </table>

            <p><b>Helper functions</b></p>

            <table>
                <tr>
                    <th>Method</th>
                    <th>Type</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td>changeView()</td>
                    <td>(viewName) : void</td>
                    <td>
                        A individually exported function, which calls the Simplr
                        Router function with the same name. Can be used to
                        easily programmatically move between views.
                    </td>
                </tr>
                <tr>
                    <td>getBreadcrumbs()</td>
                    <td>(): void</td>
                    <td>
                        A individually exported function, which calls the Simplr
                        Router function with the same name. Get an array of
                        breadcrumb objects. Breadcrumbs are created when parsing
                        the routes from the JSON structure.
                    </td>
                </tr>
            </table>

            <p><b>SimplrRouterOptions</b></p>

            <table>
                <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td><code>transitionSpeed</code></td>
                    <td><code>number</code></td>
                    <td>
                        Determines the transition speed between views in
                        milliseconds. Defaults to 200.
                    </td>
                </tr>
                <tr>
                    <td><code>notFoundAction</code></td>
                    <td>Function</td>
                    <td>
                        Function to be called, if the user navigates to a view
                        that is not found in the routes list. Defaults to null.
                    </td>
                </tr>
                <tr>
                    <td><code>forbiddenAction</code></td>
                    <td>Function</td>
                    <td>
                        Function to be called, if the user navigates to a view
                        with a guard set, and fails the guard check. Defaults to
                        null.
                    </td>
                </tr>
                <tr>
                    <td><code>debugging</code></td>
                    <td>boolean</td>
                    <td>
                        If set to <code>true</code>, Simplr Router will log it's
                        actions into the developer console
                    </td>
                </tr>
                <tr>
                    <td><code>routes</code></td>
                    <td>Array</td>
                    <td>
                        An array of <code>Route</code> objects. Defines the
                        routes of Simplr Router.
                    </td>
                </tr>
                <tr>
                    <td><code>rootPath</code></td>
                    <td>string</td>
                    <td>
                        Set the root path for the router to use. For example if
                        your project is run at
                        <code>https://www.my-test.com/my-app</code>, you could
                        set <code>/my-app</code> as your rootPath
                    </td>
                </tr>
            </table>

            <p><b>Route</b></p>

            <table>
                <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td><code>path</code></td>
                    <td>string</td>
                    <td>The URL path for the route e.g. "/getting-started"</td>
                </tr>
                <tr>
                    <td><code>component</code></td>
                    <td>string</td>
                    <td>
                        The name of the Web Component of wanted view object.
                        e.g. "router-docs-getting-started"
                    </td>
                </tr>
                <tr>
                    <td><code>import</code></td>
                    <td>Function</td>
                    <td>
                        Simplr Router supports lazy component loading. You can
                        provide a <code>import</code> -property with your route,
                        pointing at the file containing your component to lazily
                        load it during routing. e.g.
                        <code>() => import("./views/api-description")</code>
                    </td>
                </tr>
                <tr>
                    <td><code>guard</code></td>
                    <td>Function</td>
                    <td>
                        A guard is a middleware, which is checked before loading
                        the route. If a guard is checked, it is evaluated before
                        loading the view. If a truthy value is returned by the
                        guard function, the view is loaded. If a falsy value is
                        returned, the <code>forbiddenAction</code> or
                        <code>forbiddenView</code> is loaded.
                    </td>
                </tr>
                <tr>
                    <td><code>routes</code></td>
                    <td>Array</td>
                    <td>
                        A array of subroutes, which inherit the guards and the
                        path from the parent Route. Read more about subroutes
                        <a href="#">here</a>.
                    </td>
                </tr>
                <tr>
                    <td><code>slots</code></td>
                    <td>Array</td>
                    <td>An array of slots to append to the route component.</td>
                </tr>
                <tr>
                    <td><code>title</code></td>
                    <td>string</td>
                    <td>
                        The title of the view. Used currently only for
                        breadcrumbs and can be omitted, if the breadcrumbs API
                        is not used in app.
                    </td>
                </tr>
            </table>

            <p><b>Slot</b></p>

            <p>
                A slot element can be appended to a route to be appended inside
                the route component if needed.
            </p>
            <p>
                This functionality can be used to append other components to the
                view, for example a customized top-bar.
            </p>

            <p>
                For examples on creating slots refer to the recipes
                <a href="">here</a>
            </p>

            <table>
                <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td><code>Slot name (wildcard)</code></td>
                    <td>String</td>
                    <td>
                        Name of the slot, to append to. The value of this
                        property is the name of the slotted element
                    </td>
                </tr>
                <tr>
                    <td><code>import</code></td>
                    <td>Function</td>
                    <td>
                        Simplr Router supports lazy component loading for slots
                        too. You can provide a <code>import</code> -property
                        with your route, pointing at the file containing your
                        component to lazily load it during routing. e.g.
                        <code>() => import("./views/api-description")</code>
                    </td>
                </tr>
            </table>
        `;
    }
}

if (!customElements.get('router-docs-api-description')) {
    customElements.define(
        'router-docs-api-description',
        RouterDocsApiDescription
    );
}
