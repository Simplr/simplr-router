/**
 * @typedef SimplrRoute
 * @property { string } path    The URL path for the route
 * @property { string } [component] The view component name for the route
 * @property { string } [name]  Name of the view route
 * @property { Function } [import]  An import function for lazy loading. e.g. () => import("./my-view.js")
 * @property { Function } [guard]   A guard function to check view access
 * @property { SimplrRoute[] } [routes] An array of subroutes that inherit paths from the parent route
 * @property { SimplrRoute[] } [children] An array of nested routes that are rendered inside a nested router outlet
 * @property { Object.<string, string | Function>[] } [slots] An array of slots to append to the view component
 * @property { Object.<string, string> } [pattern] RegExp pattern to match dynamic route keys
 * @property { string | {name: string} } [redirect] Path to redirect to
 * @property { boolean } [preventUnload] If navigation from this page should be prevented with a confirmation dialog
 * */

export const _route = {}
