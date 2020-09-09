import SimplrRouterContainer from './simplr-router-container.js';

/**
 *  TODO:
 *  - Rewrite the stack mechanism out of this thing. We are going to use just the history API params for the route resolving
 *  - Rewrite the transition logic so that forwards and backwards movement can use the same functions
 *  - More the animation logic and timing to the container web component
 * */
export default class SimplrRouter {
    /**
     * Construct the SimplrRouter instance.
     *
     * List of possible options:
     *
     * debugging => Enable debugging? Type: Boolean, Defaults to false
     * routes => Routes JSON array from the simplr-routes file. Type: Object, Required.
     * transitionSpeed => Transition speed of the router. Type: TransitionSpeed object or float. Defaults to TransitionSpeed.FAST
     * transitionDirection => Direction the new view arrives from. Type: TransitionDirection object. Defaults to TransitionDirection.RIGHT
     *
     * @param options
     */
    constructor(options) {
        if (options === undefined) {
            throw Error('Cannot initialize SimplrRouter without options.');
        }
        this.debugging = options.debugging;
        this._log('Initializing Simplr Router...');

        this.routes = options.routes;

        this._handleViewStack();
        this._parseOptions(options);

        this.transitionInProgress = false;
        this.latestElementAdded = null;
        this.loadingIndicator = null;

        this._log('Router initialized');
    }

    _parseOptions(options) {
        this.transitionSpeed = options.transitionSpeed || TransitionSpeed.FAST;
        this.transitionDirection = options.transitionDirection || TransitionDirection.RIGHT;
        this.notFoundAction = options.notFoundAction;
        this.forbiddenAction = options.forbiddenAction;
        this.activeView = null;
    }

    _handleViewStack() {
        let wasReload = this._checkIfReload();
        let localStorageViewStack = wasReload ? JSON.parse(localStorage.getItem('Simplr-Router-ViewStack')) : null;
        if (localStorageViewStack && localStorageViewStack.length > 1) {
            localStorageViewStack.pop();
        }
        this.viewStack = localStorageViewStack ? localStorageViewStack : [];
    }

    init() {
        this._loadRoutes(this.routes);

        SimplrRouterContainer.initialize();
        this._handleUrlPathing();
        this._wrapRootView();
        this._addNewElementObserver();

        this._overrideAnchorActions();
        this._overrideReturnAction();
        SimplrRouter.Router = this;
    }

    static goTo(path) {
        if (SimplrRouter.Router) {
            SimplrRouter.Router._goToView(path);
        }
    }

    _checkIfReload() {
        let perfEntries = performance.getEntriesByType('navigation');
        let navigationEvent = perfEntries.pop();
        if (navigationEvent == null) {
            return false;
        }
        let navigationEventType = navigationEvent.type;
        return navigationEventType === 'reload';
    }

    _wrapRootView() {
        let viewWrapper = this._createViewWrapper();
        let oldParent = this.activeView.parentNode;

        if (!oldParent.nodeName === 'SIMPLR-ROUTER-CONTAINER') {
            oldParent.replaceChild(viewWrapper, this.activeView);
            viewWrapper.appendChild(this.activeView);
            this.viewStack[0].wrapper = viewWrapper;
        }
    }

    _addNewElementObserver() {
        const observer = new MutationObserver((mutationsList) => {
            mutationsList.map((entry) => {
                if (entry.target != null && this.latestElementAdded != null) {
                    if (Array.from(entry.addedNodes).includes(this.latestElementAdded.parentNode)) {
                        this._handleElementAddedToDomActions(this.latestElementAdded);
                    }
                }
            });
        });
        observer.observe(document.querySelector('body'), {
            attributes: true,
            childList: true,
            subtree: true,
        });
    }

    _parseViewFromUrl() {
        let path = window.location.pathname;
        return this._findViewForRoute(path.split('?')[0]);
    }

    _handleUrlPathing() {
        let view = this._parseViewFromUrl();
        let wrapper = this._navigateToView(view);

        wrapper.removeAttribute(this.transitionDirection);
        this.viewStack.push({ ...view, wrapper });
        if (this.activeView) {
            this.activeView.remove();
        }
        this.activeView = this.viewStack[this.viewStack.length - 1].wrapper.firstChild;
    }

    async _handleElementAddedToDomActions(newView) {
        // Find out if we could do this and the other same kind of operation in one place
        let previousView = this.viewStack[this.viewStack.length - 2];
        let wrapper = newView.parentNode;
        // Tell the new wrapper about the old one to sync actions

        if (previousView && previousView.wrapper.nodeName) {
            wrapper.previousWrapper = previousView.wrapper;
            wrapper.previousWrapperTransitionDirection = this._getOppositeTransitionAttribute();

            previousView.wrapper.addEventListener('transitionend', (e) => {
                if (e.propertyName === 'transform') {
                    this.latestElementAdded = null;
                    this.transitionInProgress = false;
                    wrapper.focus();
                    previousView.wrapper.remove();
                }
            });
        }

        window.requestAnimationFrame(() => {
            wrapper.transition();
            console.log(wrapper);
        });
    }

    _goToPreviousPage() {
        /*let oldActiveView = this.viewStack.pop();
        let newViewPath = this.viewStack[this.viewStack.length - 1];
        // TODO: re-do the transitioninprogress handling and sync the transitions
        const newView = this._findViewForRoute(this._handleLeadingSlash(newViewPath.path));
        this._transitionToView(newView, true);
        newView.wrapper = this.activeView.parentNode;
        */
        const oldView = this.activeView;
        const view = this._parseViewFromUrl();
        this._transitionToView(view, true).then(() => {
            const wrapper = this.activeView.parentNode;
            wrapper.previousWrapper = oldView.parentNode;
            wrapper.previousWrapperTransitionDirection = this._getOppositeTransitionAttribute();
        });
    }

    async _overrideAnchorActions() {
        document.body.addEventListener('click', (e) => {
            e.preventDefault();
            const path = e.path;
            let target = path.shift();
            do {
                if (target.href) {
                    const targetHref = target.href.replace(window.location.origin, '');
                    let newView = this._findViewForRoute(targetHref.split('?')[0]);
                    if (newView) {
                        e.preventDefault();
                        this._goToView(newView);
                        break;
                    }
                }
            } while ((target = path.shift()));
        });
    }

    async _goToView(view) {
        if (this.transitionInProgress) {
            return;
        }
        await this._transitionToView(view);
    }

    _overrideReturnAction() {
        window.addEventListener('popstate', () => {
            if (this._navigationPressWasBackwards()) {
                this._handleBackwardsNavigation();
            } else {
                this._handleUrlPathing();
            }
        });
    }

    _handleBackwardsNavigation() {
        if (this.viewStack.length > 1) {
            this._goToPreviousPage();
            this._saveStack();
        } else {
            window.history.back();
        }
    }

    _navigationPressWasBackwards() {
        return (
            (this.viewStack.length > 1 &&
                window.location.pathname === this.viewStack[this.viewStack.length - 2].path) ||
            (this.viewStack.length === 1 && window.location.pathname === this.viewStack[0].path)
        );
    }

    async _checkGuard(view) {
        return view.guard && typeof view.guard === 'function' && !(await view.guard.call());
    }

    async _transitionToView(newView, isPreviousAction) {
        if (!newView) {
            newView = this._handleNotFoundAction(newView);
            return false;
        }

        if (await this._checkGuard(newView)) {
            newView = this._handleForbiddenAction(newView);
            return false;
        }

        // Start transition
        this.transitionInProgress = true;
        let wrapper = this._navigateToView(newView, isPreviousAction);

        if (isPreviousAction) {
            this.activeView = wrapper.querySelector(newView.view);
            this.viewStack[this.viewStack.length - 1].wrapper = wrapper;
        } else {
            this._updateActiveView(newView, wrapper);
        }
        this._saveStack();
        window.history.pushState(null, '', newView.path);
        return true;
    }

    _navigateToView(route, isPreviousAction) {
        let viewObject = document.createElement(route.view);
        if (route.params) {
            for (let key in route.params) {
                if (route.params.hasOwnProperty(key)) {
                    viewObject.setAttribute(key, route.params[key]);
                }
            }
        }
        let viewWrapper = this._createViewWrapper(isPreviousAction);
        viewWrapper.appendChild(viewObject);

        this.latestElementAdded = viewObject;
        document.body.appendChild(viewWrapper);

        return viewWrapper;
    }

    _createViewWrapper(isPreviousAction) {
        let viewWrapper = document.createElement('simplr-router-container');
        viewWrapper.setAttribute('tabindex', 0);
        viewWrapper.setAttribute(this._getSpeedAttribute(), '');
        viewWrapper.setAttribute(
            isPreviousAction ? this._getOppositeTransitionAttribute() : this.transitionDirection,
            ''
        );

        return viewWrapper;
    }

    _saveStack() {
        localStorage.setItem('Simplr-Router-ViewStack', JSON.stringify(this.viewStack));
    }

    _handleNotFoundAction(newView) {
        if (this.notFoundAction) {
            this.notFoundAction.call();
            return null;
        } else {
            newView = this._getNotFoundRoute();
            if (newView == null) {
                throw Error('Page not found, and a not-found route has not been set.');
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
                throw Error('Access to page forbidden, and a forbidden route has not been set.');
            }
        }
        return newView;
    }

    _getNotFoundRoute() {
        let notFoundRoute = null;
        for (let i = 0; i < this.Routes.length; i++) {
            let route = this.Routes[i];
            if (route.path === 'not-found' || route.path === '/not-found') {
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
            if (route.path === 'forbidden' || route.path === '/forbidden') {
                forbiddenRoute = route;
                break;
            }
        }
        return forbiddenRoute;
    }

    _getSpeedAttribute() {
        switch (this.transitionSpeed) {
            case TransitionSpeed.SLOW:
                return 'slow';
            case TransitionSpeed.MEDIUM:
                return 'medium';
            case TransitionSpeed.FAST:
                return 'fast';
            case TransitionSpeed.VERYFAST:
                return 'very-fast';
        }
        return 'fast';
    }

    _getOppositeTransitionAttribute() {
        switch (this.transitionDirection) {
            case TransitionDirection.RIGHT:
                return 'from-left';
            case TransitionDirection.LEFT:
                return 'from-right';
        }
        return 'from-right';
    }

    _updateActiveView(route, wrapper) {
        this.activeView = wrapper.querySelector(route.view);
        this.viewStack = [...this.viewStack, { view: route.view, wrapper: wrapper, path: route.path }];
    }

    _findViewForRoute(href) {
        href = this._handleLeadingSlash(href);
        let matchedRoute = null;
        // Search for static url
        for (let i = 0; i < this.Routes.length; i++) {
            let route = this.Routes[i];
            route.path = this._handleLeadingSlash(route.path);
            if (route.path === href) {
                matchedRoute = route;
            }
        }
        if (matchedRoute == null) {
            // If static routes didn't provide answer, try dynamic urls
            let hrefParameters = this._extractUrlParameters(href);
            for (let i = 0; i < this.Routes.length; i++) {
                let route = this.Routes[i];
                route.path = this._handleLeadingSlash(route.path);
                if (!route.path.includes(':')) {
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
        let paramMatches = href.match(/\/\d+/g);
        let params = paramMatches != null ? [...paramMatches] : [];
        return params.map((p) => p.substring(1));
    }

    _extractRouteParameters(route) {
        let paramMatches = route.match(/:\w+/g);
        let params = paramMatches != null ? [...paramMatches] : [];
        return params;
    }

    _parseParameters(route, href, hrefParameters) {
        let matchedRoute;
        let routeParameters = this._extractRouteParameters(route.path);
        if (hrefParameters.length !== routeParameters.length) {
            return null;
        }

        let routePath = this._replaceRouteParamsWithHrefParams(route.path, hrefParameters, routeParameters);
        if (routePath === href) {
            let mappedParams = this._mapParameters(hrefParameters, routeParameters);
            matchedRoute = {
                path: routePath,
                view: route.view,
                params: mappedParams,
                guard: route.guard,
            };
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

    _loadRoutes(routes) {
        if (!routes) {
            throw Error(
                'No routes passed during initialization. \n\n' +
                    'Please pass routes as the second parameter when initializing SimplrRouter.'
            );
        }
        this.Routes = routes;
        if (this.debugging) {
            console.log(`${this.Routes.length} routes loaded`);
        }
    }

    _handleLeadingSlash(path) {
        if (path.substring(0, 1) !== '/') {
            path = '/' + path;
        }
        return path;
    }

    _log(message) {
        if (this.debugging) {
            console.info(message);
        }
    }
}

export const TransitionSpeed = {
    SLOW: 1500,
    MEDIUM: 1000,
    FAST: 500,
    VERYFAST: 200,
};

export const TransitionDirection = {
    RIGHT: 'from-right',
    LEFT: 'from-left',
};
