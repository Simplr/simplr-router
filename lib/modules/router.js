import { Parser } from './parser';
import { Builder } from './builder';
import { Observer } from './observer';
import { findOutlet } from './deepquery.js';
import { InitialTransitionObject, updateHistory } from './helper';
import { MiddlewareHandler } from './middleware-handler';
import { changeView } from '../simplr-router.js';
import { sendTransitionStartEvent, sendTransitionFinishEvent, sendNavigatedEvent } from './dispatcher';
import { SimplrRouterContainer } from './simplr-router-container';

export class Router {
    /**
     * @param {import("./config").Config} config
     */
    constructor(config) {
        this.config = config;
        this.parser = new Parser(config);
        this.builder = new Builder();
        this.observer = new Observer(this._getObserverFunctions());
        this.middlewareHandler = new MiddlewareHandler();
        /** @type import('../types/Shared').SimplrRouterNavigationData */
        this.currentView = null;

        const { staticRoutes, dynamicRoutes } = this.parser.parseRoutes(config.routes);
        this.staticRoutes = staticRoutes;
        this.dynamicRoutes = dynamicRoutes;

        this.notFoundAction = config.notFoundAction;
        this.forbiddenAction = config.forbiddenAction;
        this.transitionInProgress = false;
        this.activeView = null;
        this.activeViewObject = null;
    }

    /**
     * @returns { import('../types/Shared').ObserverFunctions  }
     * */
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

    /**
     * @param {import('../types/Shared').SimplrRouterNavigationData} viewObject
     * @param {string} historyPath
     */
    async changeView(viewObject, historyPath) {
        if (this.currentView?.preventUnload) {
            const leavePage = confirm('Do you want to leave this site? Changes you made may not be saved.');
            if (!leavePage) return;
        }
        if (!historyPath) {
            historyPath = viewObject.realPath;
        }

        if (viewObject?.redirect) {
            this._handleRedirect(viewObject);
            return;
        }
        viewObject = this.middlewareHandler.applyNavigatingMiddleware(viewObject);
        sendTransitionStartEvent(viewObject);
        this.currentView = viewObject;

        // Check the validity of the view. If an invalid view is loaded,
        // return early and let the error handling take lead.
        try {
            await this._checkViewValidity(viewObject);
        } catch (e) {
            return;
        }

        const component = await this._createComponent(viewObject);
        this._pushNewViewIntoDom(component, viewObject);
        updateHistory(historyPath);
        sendNavigatedEvent(viewObject, historyPath);
    }

    /**
     * @param {import('../types/Shared').SimplrRouterNavigationData} view
     * @returns {Promise<HTMLElement>}
     */
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

    /**
     * @param {any} middlewareClass
     */
    addMiddleware(middlewareClass) {
        this.middlewareHandler.add(middlewareClass);
    }

    /**
     * @param {HTMLElement} viewComponent
     * @param {import('../types/Shared').SimplrRouterNavigationData} viewObject
     * @returns {SimplrRouterContainer}
     */
    _wrapViewWithContainer(viewComponent, viewObject) {
        const container = this.builder.createViewContainer(viewObject, true, this.config.transitionSpeed);
        container.previousView = this.activeView;
        container.navigationCompleteCallback = this._handleNavigationComplete.bind(this);

        this._addViewToContainer(viewComponent, container);
        return container;
    }

    /**
     * @param {HTMLElement} viewComponent
     * @param {SimplrRouterContainer} container
     */
    _addViewToContainer(viewComponent, container) {
        if (this.middlewareHandler.addViewToContainerOverride) {
            this.middlewareHandler.addViewToContainerOverride(container, viewComponent);
        } else {
            container.appendChild(viewComponent);
        }
    }

    /**
     * @param {HTMLElement | ShadowRoot} container
     */
    _handleNavigationComplete(container) {
        sendTransitionFinishEvent();
        this.middlewareHandler.applyNavigationCompleteMiddleware(container);
        const locationHash = window.location.hash;
        if (locationHash.length > 0) {
            const targetElement = this._findScrollTarget(container, locationHash);
            targetElement?.scrollIntoView({ block: 'center', behavior: 'smooth', inline: 'center' });
        }
    }

    /**
     * @param {HTMLElement | ShadowRoot} container
     * @param {string} id
     */
    _findScrollTarget(container, id) {
        let target = container.querySelector(id);
        if (!target) {
            let shadowRoots = /** @type HTMLElement[] */ (
                Array.from(container.querySelectorAll('*')).filter((el) => el.shadowRoot)
            );
            for (const srElem of shadowRoots) {
                target = this._findScrollTarget(srElem.shadowRoot, id);
                if (target) break; // Found it!
            }
        }
        return target;
    }

    /**
     * @param {HTMLElement} component
     * @param {import('../types/Shared').SimplrRouterNavigationData} viewObject
     */
    _pushNewViewIntoDom(component, viewObject) {
        if (this._isSwappableNestedView(viewObject)) {
            this._handleNestedView(component, viewObject);
        } else if (this._isParentNestedView(viewObject)) {
            this._handleNestedView(component, viewObject, true)
        } else {
            this._handleFreshView(component, viewObject);
        }
    }

    /**
     * @param {import('../types/Shared').SimplrRouterNavigationData} viewObject
     */
    _isSwappableNestedView(viewObject) {
        return viewObject.nestedParent && (this.activeViewObject?.nestedParent === viewObject.nestedParent || this._activeViewIsNestedParentOf(viewObject));;
    }

    /**
     * @param {import('../types/Shared').SimplrRouterNavigationData} viewObject
     */
    _isParentNestedView(viewObject) {
        const nestedParentPaths = [];
        let viewParent = this.activeViewObject?.nestedParent;
        while (viewParent) {
            nestedParentPaths.push(viewParent.path);
            viewParent = viewParent.nestedParent;
        }
        return nestedParentPaths.includes(viewObject.path);
    }

    /**
     * @param {import('../types/Shared').SimplrRouterNavigationData} viewObject
     */
    _activeViewIsNestedParentOf(viewObject) {
        return this.activeViewObject?.path === viewObject.nestedParent.path;
    }

    /**
     * @param {HTMLElement} component
     * @param {import('../types/Shared').SimplrRouterNavigationData} viewObject
     * @param {boolean} [backwards = false]
     */
    _handleNestedView(component, viewObject, backwards = false) {
        if (backwards) {
            // If navigating back to a parent of a child view, we can just 
            // remove the child views, since the parent is already there
            const viewStack = []
            let currentView = this.activeViewObject;
            while (currentView) {
                viewStack.push(currentView);
                currentView = currentView.nestedParent;
            }

            while (viewStack[0]?.path !== viewObject.path) {
                const viewToRemove = viewStack.shift();
                this.activeView.querySelector(viewToRemove.component)?.remove();
            }
            // Then after removal, if we find that there should be a base view 
            // ( a child view with the path "" or "/"), but it isn't there,
            // we append it to the view
            // // TODO: Could this if block be done better?
            if (!this.activeView.querySelector(viewObject.component)) {
                const baseSubView = component.querySelector(viewObject.component);
                const childViewParent = this.activeView.querySelector(viewObject.nestedParent?.component);
                childViewParent?.appendChild(baseSubView);
                this.activeViewObject = viewObject;
            }
        } else {
            // Navigating to a sub/child view, we just replace the existing child view and
            // append the new one.
            const parentView = this.activeView.querySelector(viewObject.nestedParent.component);
            const currentNestedView = parentView.querySelector(this.activeViewObject.component);
            currentNestedView?.remove();

            const newNestedView = component.querySelector(viewObject.component);
            parentView.appendChild(newNestedView);

            this.activeViewObject = viewObject;
        }
    }

    /**
     * @param {HTMLElement} component
     * @param {import('../types/Shared').SimplrRouterNavigationData} viewObject
     */
    _handleFreshView(component, viewObject) {
        const outlet = findOutlet();
        const container = this._wrapViewWithContainer(component, viewObject);
        this._addContainerToView(outlet, container);
        if (!viewObject.initialView) {
            window.requestAnimationFrame(container.transition.bind(container));
        }
        this.middlewareHandler.applyViewAddedToDOMMiddleware(container);

        this.activeView = container;
        this.activeViewObject = viewObject;
    }

    /**
     * @param {Element} outlet
     * @param {Element} container
     */
    _addContainerToView(outlet, container) {
        if (outlet) {
            outlet.prepend(container);
        } else {
            if (this.activeView) {
                this.activeView.before(container);
            } else {
                document.body.appendChild(container);
            }
        }
    }

    handleUrlPathing() {
        const viewFromUrl = this._getViewFromUrl();
        this.changeView(InitialTransitionObject.from(viewFromUrl), viewFromUrl.path);
    }

    /**
     * @param {string} name
     */
    findRouteByName(name) {
        return this.routes.find((r) => r.name === name);
    }

    /**
     * @param {string} route
     */
    findViewForRoute(route) {
        const needle = this.parser.buildNeedle(route);

        let matchedView = this._findViewFromStaticRoutes(needle);
        if (!matchedView) {
            matchedView = this._findViewFromDynamicRoutes(needle);
        }
        return matchedView;
    }

    /**
     * @param {import('../types/Shared').SimplrRouterNavigationData} viewObject
     */
    _handleRedirect(viewObject) {
        const redirectParam = viewObject.redirect;
        /** @type import('../types/Shared').SimplrRouterNavigationData */
        let redirectRoute;
        if (typeof redirectParam === 'string') {
            redirectRoute = this.findViewForRoute(redirectParam);
        } else {
            redirectRoute = this.findRouteByName(redirectParam.name);
        }
        changeView({ path: redirectRoute.path });
    }

    /**
     * @param {import('../types/Shared').SimplrRouterNavigationData} newView
     */
    _checkViewValidity(newView) {
        return new Promise(async (resolve, reject) => {
            if (!newView.component) {
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

    /**
     * @param {import('../types/Shared').SimplrRouterNavigationData} view
     */
    async _guardFails(view) {
        return view && view.guard && typeof view.guard === 'function' && !(await view.guard.call(this, view.params));
    }

    _getViewFromUrl() {
        return this.findViewForRoute(this.parser.parseViewFromUrl());
    }

    /**
     * @param {string} needle
     */
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

    /**
     * @param {any} needle
     */
    _findViewFromDynamicRoutes(needle) {
        const needleParts = this.parser.splitRouteParts(needle);
        let found = null;
        for (let route of this.dynamicRoutes) {
            const dynamicRoute = { ...route };
            // We make the future lookups faster by saving this into memory.
            // And we make the first load faster by not doing this at startup.
            if (!dynamicRoute.parts) {
                dynamicRoute.parts = this.parser.splitRouteParts(route.path);
            }
            // If the parts are not the same length, there's no use in comparing.
            if (dynamicRoute.parts.length !== needleParts.length) {
                continue;
            }

            // Check that all of the non-dynamic parts match.
            let match = true;
            for (let index in dynamicRoute.parts) {
                const routePart = dynamicRoute.parts[index];
                const needlePart = needleParts[index];

                if (routePart.includes(':')) continue;
                if (routePart !== needlePart) {
                    match = false;
                    break;
                }
            }

            if (!match) {
                continue;
            }

            // Map the parts from the url to the route instance
            this.parser.mapParametersForRoute(dynamicRoute, needleParts);

            if (dynamicRoute.pattern) {
                let paramsMatchPattern = true;
                for (const pattern of Object.entries(dynamicRoute.pattern)) {
                    const key = pattern[0];
                    const matcher = new RegExp(pattern[1]);

                    const paramMatchesPattern = matcher.exec(dynamicRoute.params[key]);

                    const urlParameterIsValid =
                        paramMatchesPattern && paramMatchesPattern[0] === paramMatchesPattern.input;
                    if (!urlParameterIsValid) {
                        paramsMatchPattern = false;
                        break;
                    }
                }

                if (!paramsMatchPattern) {
                    // Pattern doesn't match
                    continue;
                }
            }

            // If it passes all the checks, we have our route.
            found = dynamicRoute;
        }
        return found;
    }

    _handleNotFoundAction() {
        console.error("foo");
        if (this.notFoundAction) {
            this.notFoundAction.call();
            return;
        }
        const notFoundView = this.findViewForRoute('not-found');
        if (notFoundView) {
            this.changeView(InitialTransitionObject.from(notFoundView));
        } else {
            throw Error("No view found and no 'not-found' -route or action set.");
        }
    }

    _handleForbiddenAction() {
        if (this.forbiddenAction) {
            this.forbiddenAction.call();
            return;
        }
        const forbiddenView = this.findViewForRoute('forbidden');
        if (forbiddenView) {
            this.changeView(InitialTransitionObject.from(forbiddenView));
        } else {
            throw Error("Forbidden route and no 'forbidden' -route or action set.");
        }
    }
}
