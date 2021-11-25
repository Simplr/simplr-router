/**
 * @typedef SimplrRouterOptions
 * @property { import("./SimplrRoute").SimplrRoute[] } routes   Routes provided for the Simplr Router.
 * @property { string } rootPath    Root path of the router. If the root is not the origin of the host.
 * @property { number } [transitionSpeed]   Transition speed of view transitions in milliseconds.
 * @property { Function } [notFoundAction]  Action triggered when a view is not found.
 * @property { Function } [forbiddenAction] Action triggered when access to a view is forbidden by a guard function.
 * @property { boolean } [debugging] Enable debugging
 * */

export const RouterOptions = {};
