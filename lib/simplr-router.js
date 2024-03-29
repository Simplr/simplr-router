import { Config } from './modules/config.js';
import { Router } from './modules/router.js';
import { SimplrRouterContainer } from './modules/simplr-router-container.js';
import { SimplrRouterOutlet } from './modules/simplr-router-outlet.js';
import { ForwardsTransitionObject } from './modules/helper.js';
import { sendRouterInitializedEvent } from './modules/dispatcher.js';

/**
 * @class SimplrRouter
 * */
export class SimplrRouter {
    /**
     * @param {import('./types/SimplrRouterOptions.js').SimplrRouterOptions} options
     */
    constructor(options) {
        if (options === undefined) {
            throw Error('Cannot initialize SimplrRouter without options.');
        }

        this.config = new Config(options);
        this.router = new Router(this.config);
        this.routes = [];

        SimplrRouter._instance = this;
    }

    init() {
        SimplrRouterContainer.initialize(this.config.transitionSpeed);
        SimplrRouterOutlet.initialize(this.config.transitionSpeed);

        this.router.handleUrlPathing();
        sendRouterInitializedEvent(this.routes);
    }

    /**
     * @param {import('./types/Shared.js').ChangeViewObject} changeViewObject
     * */
    changeView({ path, name, hash }) {
        // If name provided instead of path
        let routePath = path;
        let routeHash = hash ?? '';
        if (!path && name) {
            routePath = this.router.findRouteByName(name).path;
        }
        const viewForRoute = this.router.findViewForRoute(routePath);
        this.router.changeView(ForwardsTransitionObject.from(viewForRoute), viewForRoute.realPath + routeHash);
    }

    /**
     * @param {any} middlewareClass
     */
    use(middlewareClass) {
        this.router.addMiddleware(middlewareClass);
    }

    getBreadcrumbs() {
        return this.router.getBreadcrumbs();
    }

    getCurrentView() {
        return this.router.currentView;
    }
}

SimplrRouter._instance = undefined;

export const changeView = (/** @type {import('./types/Shared.js').ChangeViewObject} */ changeViewObject) =>
    SimplrRouter._instance.changeView(changeViewObject);
export const getBreadcrumbs = () => SimplrRouter._instance.getBreadcrumbs();
export const getCurrentView = () => SimplrRouter._instance.getCurrentView();

export * from './types/SimplrRouterOptions.js';
export * from './types/SimplrRoute.js';
export * from './types/Shared.js';
