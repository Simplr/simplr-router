import SimplrRouterStyler from "./simplr-router-styler";
import {TransitionDirection} from "./simplr-router-transition-direction";
import {TransitionSpeed} from "./simplr-router-transition-speed";

export default class SimplrRouter {

    constructor(activeView, useStyles) {
        this.rootView = activeView;
        this.activeView = activeView;
        this.viewStack = [{view: activeView.nodeName.toLowerCase(), wrapper: activeView, path: "/"}];
        this.body = document.querySelector("body");
        this.transitionSpeed = TransitionSpeed.FAST;
        this.transitionDirection = TransitionDirection.RIGHT;
        this.useStyles = useStyles === undefined ? true : useStyles;
        this.transitionInProgress = false;
        this.notFoundAction = null;
        this.forbiddenAction = null;

        this._loadRoutes();
        this._addNewElementObserver();
        this._overrideAnchorActions(document.querySelector("body"));
        this._overrideReturnAction();
        this._createStyles();

        this._handleUrlPathing();

        console.info("Router initialized");
    }

    static init(activeView, useStyles) {
        console.info("Initializing Simplr Router...");
        this.Router = new SimplrRouter(activeView, useStyles);
    }

    _addNewElementObserver() {
        const observer = new MutationObserver((mutationsList) => {
            mutationsList.map(entry => {
                if (entry.target != null) {
                    Array.from(entry.target.querySelectorAll("a")).map(anchor => {
                        if (!anchor.dataset.hasOwnProperty("simplrRoute")) {
                            return;
                        }
                        this._overrideAnchorActions(entry.target);
                    });
                }
            });
        });
        observer.observe(document.querySelector("body"), {attributes: true, childList: true, subtree: true});
    }

    _handleUrlPathing() {
        let path = window.location.pathname;
        if (path === "/") {
            return;
        }
        // Set root layer to history stack, so the user can return to the
        // front page if linked to a sub page
        window.history.replaceState({}, '', "/");
        window.history.pushState({}, '', path);

        this._transitionToView(this._handleLeadingSlash(path));
        document.querySelector("body").click();
    }

    _overrideAnchorActions(target) {
        target.querySelectorAll("a").forEach(anchor => {
            if (!anchor.dataset.hasOwnProperty("simplrRoute")) {
                return;
            }
            anchor.addEventListener("click", (e) => {
                e.preventDefault();
                if (this.transitionInProgress) {
                    return;
                }
                let anchorAddress = this._handleLeadingSlash(anchor.getAttribute("href"));
                let transitionSuccessful = this._transitionToView(anchorAddress);

                if (transitionSuccessful) {
                    window.history.pushState(null, "", anchorAddress);
                }
           });
            anchor.removeAttribute("data-simplr-route");
            anchor.setAttribute("data-simplr-route-initialized", "");
        });
    }

    _overrideReturnAction() {
        window.history.pushState({}, '');
        window.addEventListener("popstate", () => {
            // If navigating backwards
            if (this._navigationPressWasBackwards()) {
                this._handleBackwardsNavigation();
            } else {
                this._handleUrlPathing();
            }
        });
    }

    _handleBackwardsNavigation() {
        if (this.viewStack.length > 1) {
            let oldActiveView = this.viewStack.pop();
            oldActiveView.wrapper.classList.add(this.transitionDirection);
            setTimeout(() => {
                oldActiveView.wrapper.remove();
            }, this.transitionSpeed * 1000);
        } else {
            window.history.back();
        }
    }

    _navigationPressWasBackwards() {
        return (this.viewStack.length > 1 &&
            window.location.pathname === this.viewStack[this.viewStack.length - 2].path) ||
            (this.viewStack.length === 1 &&
                window.location.pathname === this.viewStack[0].path);
    }

    _transitionToView(viewToTransitionTo) {
        let newView = this._findViewForRoute(viewToTransitionTo);

        if (!newView) {
            newView = this._handleNotFoundAction(newView);
            if (newView == null) return false;
        }
        if (newView.guard && typeof newView.guard === "function" && !newView.guard.call()) {
            newView = this._handleForbiddenAction(newView);
            if (newView == null) return false;
        }
        this.transitionInProgress = true;

        let wrapper = this._navigateToView(newView);
        this._updateActiveView(newView, wrapper);
        setTimeout(() => {
            this.transitionInProgress = false;
        }, this.transitionSpeed* 1000);
        return true;
    }

    _handleNotFoundAction(newView) {
        if (this.notFoundAction) {
            this.notFoundAction.call();
            return null;
        } else {
            newView = this._getNotFoundRoute();
            if (newView == null) {
                console.error("Page not found, and a not-found route has not been set.");
                return null;
            }
        }
        return newView;
    }

    _handleForbiddenAction(newView) {
        if (this.forbiddenAction) {
            this.forbiddenAction.call();
            return null;
        } else {
            newView = this._getForbiddenRoute();
            if (newView == null) {
                console.error("Access to page forbidden, and a forbidden route has not been set.");
                return null;
            }
        }
        return newView;
    }

    _getNotFoundRoute() {
        let notFoundRoute = null;
        for (let i = 0; i < this.Routes.length; i++) {
            let route = this.Routes[i];
            if (route.path === "not-found" || route.path === "/not-found") {
                notFoundRoute = route;
                break;
            }
        }
        return notFoundRoute;
    }

    _getForbiddenRoute() {
        let forbiddenRoute = null;
        for (let i = 0; i < this.Routes.length; i++) {
            let route = this.Routes[i];
            if (route.path === "forbidden" || route.path === "/forbidden") {
                forbiddenRoute = route;
                break;
            }
        }
        return forbiddenRoute;
    }

    _navigateToView(route) {
        let viewObject = document.createElement(route.view);
        if (route.params) {
            for (let key in route.params) {
                if (route.params.hasOwnProperty(key)) {
                    viewObject.setAttribute(key, route.params[key]);
                }
            }
        }
        let viewWrapper = document.createElement("div");
        viewWrapper.classList.add("simplr-router-view-wrapper");
        viewWrapper.classList.add(this.transitionDirection);
        viewWrapper.appendChild(viewObject);
        this.body.appendChild(viewWrapper);

        setTimeout(() => {
            viewWrapper.classList.remove(this.transitionDirection);
        }, 10);
        return viewWrapper;
    }

    _updateActiveView(route, wrapper) {
        this.activeView = wrapper.querySelector(route.view);
        this.viewStack = [...this.viewStack, {view: route.view, wrapper: wrapper, path: route.path}];
    }

    _findViewForRoute(href) {
        let matchedRoute = null;
        // Search for static url
        for (let i = 0; i < this.Routes.length; i++) {
            let route = this.Routes[i];
            route.path = this._handleLeadingSlash(route.path);
            if (route.path === href) {
                matchedRoute = route;
                matchedRoute.path = route.path;
                matchedRoute.guard = route.guard;
            }
        }
        if (matchedRoute == null) {
            // If static routes didn't provide answer, try dynamic urls
            let hrefParameters = this._extractUrlParameters(href);
            for (let i = 0; i < this.Routes.length; i++) {
                let route = this.Routes[i];
                route.path = this._handleLeadingSlash(route.path);
                if (!route.path.includes(":")) {
                    continue;
                }
                matchedRoute = this._parseParameters(route, href, hrefParameters);
                if (matchedRoute != null) {
                    break;
                }
            }
        }
        return matchedRoute;
    }

    _extractUrlParameters(href) {
        let params = [...href.matchAll(/\/\d+/g)];
        return params.map(p => p[0].substring(1));
    }

    _extractRouteParameters(route) {
        let params = [...route.matchAll(/:\w+/g)];
        return params.map(p => p[0]);
    }

    _parseParameters(route, href, hrefParameters) {
        let matchedRoute;
        let routeParameters = this._extractRouteParameters(route.path);
        if (hrefParameters.length !== routeParameters.length) {
            return;
        }

        let routePath = this._replaceRouteParamsWithHrefParams(route.path, hrefParameters, routeParameters);
        if (routePath === href) {
            let mappedParams = this._mapParameters(hrefParameters, routeParameters);
            matchedRoute = {path: routePath, view: route.view, params: mappedParams, guard: route.guard};
        }

        return matchedRoute;
    }

    _replaceRouteParamsWithHrefParams(path, hrefParams, routeParams) {
        for (let i = 0; i < hrefParams.length; i++) {
            path = path.replace(routeParams[i], hrefParams[i]);
        }
        return path;
    }

    _mapParameters(hrefParams, routeParams) {
        let params = {};
        for (let i = 0; i < hrefParams.length; i++) {
            params[routeParams[i].substring(1)] = hrefParams[i];
        }
        return params;
    }

    _loadRoutes() {
        let Routes;
        try {
            let importedRoutes = require("simplr-routes.js");
            Routes = importedRoutes.routes;
        } catch (ex) {
            if (Routes == null) {
                console.error("Routes file has not been initialized. \n\n" +
                    "Please initialize 'simplr-routes.js' -file in the root directory of the project.");
            }
            return;
        }
        console.log(`Router with ${Routes.length} routes loaded.`);
        this.Routes = Routes;
    }

    _createStyles() {
        if (this.useStyles) {
            SimplrRouterStyler.addStyles(this);
        }
    }

    _handleLeadingSlash(path) {
        if (path.substring(0,1) !== "/") {
            path = "/" + path;
        }
        return path;
    }

    static setTransitionSpeed(speed) {
        if (typeof speed == "number") {
            this.Router.transitionSpeed = speed;
            this.Router._createStyles();
        } else {
            console.error(`Attempted to set transition speed to ${speed}, but ${speed} is not a viable speed parameter.`);
        }
    }

    static setTransitionDirection(transitionDir) {
        if (Object.values(TransitionDirection).includes(transitionDir)) {
            this.Router.transitionDirection = transitionDir;
            this.Router._createStyles();
        } else {
            console.error(`Attempted to set transition direction to ${transitionDir}, but ${transitionDir} is not a preset direction.\nPlease use a preset direction spesified in TransitionDirection-object.`);
        }
    }

    static setForbiddenAction(action) {
        this.Router.forbiddenAction = action;
    }

    static setNotFoundAction(action) {
        this.Router.notFoundAction = action;
    }
}