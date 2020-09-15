import Parser from './parser';
import Builder from './builder';
import Observer from './observer';
import { InitialTransitionObject } from './helper';
import Dispatcher from './dispatcher';

export default class Router {
    constructor(routes, notFoundAction, forbiddenAction) {
        this.parser = new Parser();
        this.builder = new Builder();
        this.observer = new Observer(this._getObserverFunctions());

        Object.assign(this, this.parser.parseRoutes(routes));

        this.notFoundAction = notFoundAction;
        this.forbiddenAction = forbiddenAction;
        this.transitionInProgress = false;
    }

    _getObserverFunctions() {
        return {
            findViewForRoute: this.findViewForRoute.bind(this),
            changeView: this.changeView.bind(this),
            getViewFromUrl: this._getViewFromUrl.bind(this),
        };
    }

    get routes() {
        return [...this.staticRoutes, ...this.dynamicRoutes];
    }

    changeView(viewObject) {
        // Check for the view existence and guards
        Dispatcher.sendTransitionStartEvent(viewObject);
        this._checkViewValidity(viewObject.view).then(() => {
            // Create the component for the view
            this.builder.createComponentElement(viewObject.view).then((component) => {
                // Create the wrapper for the view component
                const container = this._wrapViewWithContainer(component, viewObject);
                this._pushNewViewIntoDom(container);
            });
        });
    }

    _wrapViewWithContainer(viewComponent, viewObject) {
        const container = this.builder.createViewContainer(viewObject, true);
        container.previousView = this.activeView;
        container.appendChild(viewComponent);
        return container;
    }

    _pushNewViewIntoDom(container) {
        document.body.appendChild(container);
        this.activeView = container;

        window.requestAnimationFrame(() => {
            container.transition();
        });
    }

    handleUrlPathing() {
        this.changeView(new InitialTransitionObject(this._getViewFromUrl()));
    }

    findViewForRoute(route) {
        const needle = this.parser.handleLeadingSlash(route);

        let matchedView = this._findViewFromStaticRoutes(needle);
        if (!matchedView) {
            matchedView = this._findViewFromDynamicRoutes(needle);
        }
        return matchedView;
    }

    _checkViewValidity(newView) {
        return new Promise(async (resolve, reject) => {
            if (!newView) {
                this._handleNotFoundAction();
                reject();
            }
            if (await this._guardFails(newView)) {
                this._handleForbiddenAction();
                reject();
            }
            resolve();
        });
    }

    async _guardFails(view) {
        return view && view.guard && typeof view.guard === 'function' && !(await view.guard.call());
    }

    _getViewFromUrl() {
        return this.findViewForRoute(this.parser.parseViewFromUrl());
    }

    _findViewFromStaticRoutes(needle) {
        let found = null;
        for (let route of this.staticRoutes) {
            if (route.path === needle) {
                found = route;
                break;
            }
        }
        return found;
    }

    _findViewFromDynamicRoutes(needle) {
        const needleParts = this.parser.splitRouteParts(needle);
        let found = null;
        for (let route of this.dynamicRoutes) {
            // We make the future lookups faster by saving this into memory.
            // And we make the first load faster by not doing this at startup.
            if (!route.parts) {
                route.parts = this.parser.splitRouteParts(route.path);
            }
            // If the parts are not the same length, there's no use in comparing.
            if (route.parts.length !== needleParts.length) {
                continue;
            }

            // Check that all of the non-dynamic parts match.
            let match = true;
            for (let index in route.parts) {
                const routePart = route.parts[index];
                const needlePart = needleParts[index];

                if (routePart.includes(':')) continue;
                if (routePart !== needlePart) {
                    match = false;
                    break;
                }
            }
            if (match) {
                found = route;
                this.parser.mapParametersForRoute(found, needleParts);
                break;
            }
        }
        return found;
    }

    _handleNotFoundAction() {
        if (this.notFoundAction) {
            this.notFoundAction.call();
            return;
        }
        this.changeView(new InitialTransitionObject(this.findViewForRoute('not-found')));
    }

    _handleForbiddenAction() {
        if (this.forbiddenAction) {
            this.forbiddenAction.call();
            return;
        }
        this.changeView(new InitialTransitionObject(this.findViewForRoute('forbidden')));
    }
}
