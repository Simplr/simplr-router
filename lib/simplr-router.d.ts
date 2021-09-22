export as namespace SimplrRouter;

export declare class SimplrRouter {
    /**
     * The Constructor method of Simplr Router. Takes the SimplrRouterOptions object as a parameter.
     *
     * @param {SimplrRouterOptions} options
     * */
    constructor(options: SimplrRouterOptions);

    /**
     * The initializer method of Simplr Router.
     *
     * No routing action will be done before this is called.
     *
     * Loads up the current url's view during initialization.
     * */
    init(): void;

    /**
     * A helper function to navigate to a new view programmatically.
     *
     * The format of the view should be the same as it would be in a a -anchor tag
     *
     * @param {string} the name of the view to transition to
     * */
    changeView(viewName: string): void;
}

/**
 * A helper function to navigate to a new view programmatically.
 *
 * The format of the view should be the same as it would be in a a -anchor tag
 *
 * @param {string} the name of the view to transition to
 * */
export function changeView(viewName: string): void;

export interface SimplrRouterOptions {
    /**
     * Transition speed of the view transition animation.
     *
     * Set to 0 to remove animation.
     * */
    transitionSpeed?: number;
    /**
     * Function to be executed, if the wanted route is not found.
     * */
    notFoundAction?: Function;
    /**
     * Function to be executed, if the wanted route has a guard that the user fails.
     * */
    forbiddenAction?: Function;
    /**
     * Enable debugging
     * */
    debugging?: boolean;
    /**
     * Array of routes to use for routing
     * */
    routes: Array<SimplrRoute>;
    /**
     * A Root Path for the router to use. Will append it to all of the routes
     * provided, to create the full actual url.
     *
     * e.g. /my-app if the domain's index is hosted at https://example.com/my-app
     * */
    rootPath?: string;
}

export interface SimplrRoute {
    /**
     * The URL path for the route e.g. "/getting-started"
     * */
    path: string;
    /**
     * The name of the Web Component of wanted view object. e.g. "router-docs-getting-started"
     * */
    component: string;
    /**
     * Simplr Router supports lazy component loading.
     * You can provide a import -property with your route, importing the file containing your component to lazily load it during routing.
     *
     * e.g. import("./views/second-module.js")
     * */
    import?: Function;
    /**
     * A guard is a middleware, which is checked before loading the route.
     *
     * If a guard is checked, it is evaluated before loading the view.
     *
     * If a truthy value is returned by the guard function, the view is loaded.
     * If a falsy value is returned, the forbiddenAction or forbiddenView is loaded.
     * */
    guard?: Function;
    /**
     * An array of subroutes, which inherit the guards and the path from the parent SimplrRoute
     * */
    routes?: Array<SimplrRoute>;
    /**
     * An array of slots to append to the route component when loaded
     *
     * Format of a slot Object is as follows:
     *
     * {
     *   'top-bar': 'user-topbar',
     *   import: () => import('./partials/user-top-bar.js')
     * }
     *
     * Where 'top-bar' is the name of the slot the component is appended to,
     * and import is an optional parameter for dynamic imports.
     *
     * */
    slots?: Array<Object>;

    /**
     * The title of the view. Currently only used for breadcrumbs, and can be omitted
     * */
    title?: string;
}
