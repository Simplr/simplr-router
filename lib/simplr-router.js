import Logger from './modules/logger';
import Config from './modules/config';
import Router from './modules/router';
import SimplrRouterContainer from './modules/simplr-router-container';
import { ForwardsTransitionObject, updateHistory } from './modules/helper';
import Dispatcher from './modules/dispatcher';

export default class SimplrRouter {
    constructor(options) {
        if (options === undefined) {
            throw Error('Cannot initialize SimplrRouter without options.');
        }

        this.logger = new Logger(options);
        this.config = new Config(options);

        SimplrRouter._instance = this;
    }

    init() {
        this.router = new Router(this.config);

        this.logger.info(`${this.router.routes.length} routes loaded.`);
        SimplrRouterContainer.initialize(this.config.transitionSpeed);

        this.router.handleUrlPathing();
        Dispatcher.sendRouterInitializedEvent(this.routes);
    }

    changeView(viewName) {
        const needle = this.router.parser.buildNeedle(viewName);
        updateHistory(needle);
        this.router.changeView(new ForwardsTransitionObject(this.router.findViewForRoute(needle)));
    }

    getBreadcrumbs() {
        return this.router.getBreadcrumbs();
    }
}

export const changeView = (viewName) => SimplrRouter._instance.changeView(viewName);
export const getBreadcrumbs = () => SimplrRouter._instance.getBreadcrumbs();
