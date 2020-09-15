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
        this.routes = options.routes;

        SimplrRouter._instance = this;
    }

    init() {
        this.router = new Router(this.routes, this.config.notFoundAction, this.config.forbiddenAction);
        this.routes = null;

        this.logger.info(`${this.router.routes.length} routes loaded.`);
        SimplrRouterContainer.initialize(this.config.transitionSpeed);

        this.router.handleUrlPathing();
        Dispatcher.sendRouterInitializedEvent(this.routes);
    }

    changeView(viewName) {
        updateHistory(viewName);
        this.router.changeView(new ForwardsTransitionObject(this.router.findViewForRoute(viewName)));
    }
}

export const changeView = (viewName) => SimplrRouter._instance.changeView(viewName);
