/**
 * @typedef ChangeViewObject
 * @property {string} [path]
 * @property {string} [name]
 * @property {string} [hash]
 * */

/**
 * @typedef SimplrRouterNavigationDataProps
 *
 * @property { string } [realPath]   The original determined path of the route
 * @property { string[] } [parts]   String parts of the parsed route
 * @property { Object.<string, string> } [params]   Dynamic parts of the route mapped
 * @property { boolean } backwards   If the navigation is being done backwards in history
 * @property { boolean } initialView   If this is the initial view loaded first on load instead of navigation
 * @property { SimplrRouterBreadcrumb[] } crumbs  The breadcrumbs to the current path
 *
 * @typedef { SimplrRoute & SimplrRouterNavigationDataProps } SimplrRouterNavigationData
 * */

/**
 * @typedef SimplrRouterBreadcrumb
 * @property {string} path
 * @property {string} [name]
 * @property {Object.<string, string>} [params]
 * */

/**
 * @typedef ObserverFunctions
 * @property { Function  } findViewForRoute
 * @property { Function  } changeView
 * @property { Function  } getViewFromUrl
 * */
