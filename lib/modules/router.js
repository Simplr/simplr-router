import Parser from './parser';
import Builder from './builder';
import Observer from './observer';
import { InitialTransitionObject } from './helper';
import MiddlewareHandler from './middleware-handler';
import { sendTransitionStartEvent, sendTransitionFinishEvent } from './dispatcher';

export default class Router {
    constructor(config) {
        this.config = config;
        this.parser = new Parser(config);
        this.builder = new Builder();
        this.observer = new Observer(this._getObserverFunctions());
        this.middlewareHandler = new MiddlewareHandler();

        const { staticRoutes, dynamicRoutes } = this.parser.parseRoutes(config.routes)
        this.staticRoutes = staticRoutes;
        this.dynamicRoutes = dynamicRoutes;

        this.notFoundAction = config.notFoundAction;
        this.forbiddenAction = config.forbiddenAction;
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

    async changeView(viewObject) {
        viewObject = this.middlewareHandler.applyNavigatingMiddleware(viewObject);
        sendTransitionStartEvent(viewObject);
        this.currentView = viewObject.view;

        // Check the validity of the view. If an invalid view is loaded,
        // return early and let the error handling take lead.
        try {
            await this._checkViewValidity(viewObject.view);
        } catch (e) {
            return;
        }

        const component = await this._createComponent(viewObject.view);
        const container = this._wrapViewWithContainer(component, viewObject);
        this._pushNewViewIntoDom(container, viewObject.initialView);
    }

    _createComponent(view) {
        if (this.middlewareHandler.componentCreationOverride) {
            return this.middlewareHandler.componentCreationOverride(view);
        } else {
            return this.builder.createComponentElement(view);
        }
    }

    getBreadcrumbs() {
        if (!this.currentView.params) {
            return this.currentView.crumbs;
        }
        const params = this.currentView.params;
        return this.currentView.crumbs.map((crumb) => {
            const copy = { ...crumb }; // Prevent overwriting
            if (copy.path.includes(':')) {
                copy.params = {};
                Object.keys(params).forEach((key) => {
                    copy.path = copy.path.replace(`:${key}`, params[key]);
                    copy.params = params;
                });
            }
            return copy;
        });
    }

    addMiddleware(middlewareClass) {
        this.middlewareHandler.add(middlewareClass);
    }

    _wrapViewWithContainer(viewComponent, viewObject) {
        const container = this.builder.createViewContainer(viewObject, true, this.config.transitionSpeed);
        container.previousView = this.activeView;
        container.navigationCompleteCallback = this._handleNavigationComplete.bind(this);

        this._addViewToContainer(viewComponent, container);
        return container;
    }

    _addViewToContainer(viewComponent, container) {
        if (this.middlewareHandler.addViewToContainerOverride) {
            this.middlewareHandler.addViewToContainerOverride(container, viewComponent);
        } else {
            container.appendChild(viewComponent);
        }
    }

    _handleNavigationComplete(container) {
        sendTransitionFinishEvent();
        this.middlewareHandler.applyNavigationCompleteMiddleware(container);
        const locationHash = window.location.hash;
        if (locationHash.length > 0) {
            const targetElement = this._findScrollTarget(container, locationHash);
            targetElement.scrollIntoView({ block: "center", behavior: "smooth", inline: "center" });
        }
    }

    _findScrollTarget(container, id) {
        let target = container.querySelector(id);
        if (!target) {
            let shadowRoots = Array.from(container.querySelectorAll("*")).filter(el => el.shadowRoot);
            for (const srElem of shadowRoots) {
                target = this._findScrollTarget(srElem.shadowRoot, id);
                if (target) break; // Found it!
            }
        }
        return target;
    }

    _pushNewViewIntoDom(container, isInitialView) {
        document.body.appendChild(container);
        this.activeView = container;
        if (!isInitialView) {
            window.requestAnimationFrame(container.transition.bind(container));
        }
        this.middlewareHandler.applyViewAddedToDOMMiddleware(container);
    }

    handleUrlPathing() {
        this.changeView(new InitialTransitionObject(this._getViewFromUrl()));
    }

    findRouteByName(name) {
        return this.routes.find(r => r.name === name);
    }

    findViewForRoute(route) {
        const needle = this.parser.buildNeedle(route);

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
        const notFoundView = this.findViewForRoute('not-found', true);
        if (notFoundView) {
            this.changeView(new InitialTransitionObject(notFoundView));
        } else {
            throw Error("No view found and no 'not-found' -route or action set.");
        }
    }

    _handleForbiddenAction() {
        if (this.forbiddenAction) {
            this.forbiddenAction.call();
            return;
        }
        const forbiddenView = this.findViewForRoute('forbidden', true);
        if (forbiddenView) {
            this.changeView(new InitialTransitionObject(forbiddenView));
        } else {
            throw Error("Forbidden route and no 'forbidden' -route or action set.");
        }
    }
}
