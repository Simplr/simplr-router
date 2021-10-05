import Config from './modules/config';
import Router from './modules/router';
import SimplrRouterContainer from './modules/simplr-router-container';
import { ForwardsTransitionObject, updateHistory } from './modules/helper';
import { sendRouterInitializedEvent } from './modules/dispatcher';

export class SimplrRouter {
    constructor(options) {
        if (options === undefined) {
            throw Error('Cannot initialize SimplrRouter without options.');
        }

        this.config = new Config(options);
        this.router = new Router(this.config);

        SimplrRouter._instance = this;
    }

    init() {
        SimplrRouterContainer.initialize(this.config.transitionSpeed);

        this.router.handleUrlPathing();
        sendRouterInitializedEvent(this.routes);
    }

    changeView({ path, name, hash }) {
        // If name provided instead of path
        let routePath = path
        let routeHash = hash ?? "";
        if (!path && name) {
            routePath = this.router.findRouteByName(name).path;
        }
        const viewForRoute = this.router.findViewForRoute(routePath);
        updateHistory(viewForRoute.realPath + routeHash);
        this.router.changeView(new ForwardsTransitionObject(viewForRoute));
    }

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

export const changeView = (viewName) => SimplrRouter._instance.changeView(viewName);
export const getBreadcrumbs = () => SimplrRouter._instance.getBreadcrumbs();
