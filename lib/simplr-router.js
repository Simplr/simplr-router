import SimplrRouterStyler from './simplr-router-styler';
import { TransitionDirection } from './simplr-router-transition-direction';
import { TransitionSpeed } from './simplr-router-transition-speed';

export default class SimplrRouter {
    /**
     * Construct the SimplrRouter instance.
     *
     * List of possible options:
     *
     * debugging => Enable debugging? Type: Boolean, Defaults to false
     * activeView => The active view the router is initialized from. Usually set to the root layer of application. Type: Object, Required.
     * routes => Routes JSON array from the simplr-routes file. Type: Object, Required.
     * transitionSpeed => Transition speed of the router. Type: TransitionSpeed object or float. Defaults to TransitionSpeed.FAST
     * transitionDirection => Direction the new view arrives from. Type: TransitionDirection object. Defaults to TransitionDirection.RIGHT
     * useStyles => Should Router use the default transitions built into the library? Type: Boolean. Defaults to true
     * waitForLoad => Should Simplr Router delay render until loading is done? Type: Boolean. Defaults to false
     * stackedViews => Should the views be stacked or should a new view just replace the last view? Type: Boolean. Defaults to false
     *
     * @param options
     */
    constructor(options) {
        if (options === undefined) {
            throw Error('Cannot initialize SimplrRouter without options.');
        }
        this.debugging = options.debugging;
        if (this.debugging) {
            console.info('Initializing Simplr Router...');
        }

        this.rootView = options.activeView;
        this.lastActiveView = null;
        this.activeView = options.activeView;
        this.routes = options.routes;
        if (options.activeView == null) {
            throw Error(
                'Cannot initialize SimplrRouter because active view is null.'
            );
        }
        let wasReload = this._checkIfReload();
        let localStorageViewStack = wasReload
            ? JSON.parse(localStorage.getItem('Simplr-Router-ViewStack'))
            : null;
        if (localStorageViewStack && localStorageViewStack.length > 1) {
            localStorageViewStack.pop();
        }
        this.viewStack = localStorageViewStack
            ? localStorageViewStack
            : [
                  {
                      view: this.activeView.nodeName.toLowerCase(),
                      wrapper: this.activeView,
                      path: '/',
                  },
              ];
        this.body = document.querySelector('body');
        this.transitionSpeed =
            options.transitionSpeed === undefined
                ? TransitionSpeed.FAST
                : options.transitionSpeed;
        this.transitionDirection =
            options.transitionDirection === undefined
                ? TransitionDirection.RIGHT
                : options.transitionDirection;
        this.useStyles =
            options.useStyles === undefined ? true : options.useStyles;

        this.notFoundAction = options.notFoundAction;
        this.forbiddenAction = options.forbiddenAction;
        this.waitForLoad = options.waitForLoad;
        this.stackedViews =
            options.stackedViews === undefined ? false : options.stackedViews;

        this.transitionInProgress = false;
        this.latestElementAdded = null;
        this.loadingIndicator = null;

        if (this.debugging) {
            console.info('Router initialized');
        }
    }

    init() {
        this._loadRoutes(this.routes);
        this._createStyles();

        // On stacked views we need to have the observer ready for
        // additional pages that are loaded, if the user for example refreshes
        // or arrives to a subpage from a link
        if (this.stackedViews) {
            this._addNewElementObserver();
            this._wrapRootView();
            this._handleUrlPathing();
        } else {
            this._handleUrlPathing();
            this._wrapRootView();
            this._addNewElementObserver();
        }

        this._overrideAnchorActions(document.querySelector('body'));
        this._overrideReturnAction();
        SimplrRouter.Router = this;
    }

    static navigateToPath(path) {
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

        if (!oldParent.classList.contains('simplr-router-view-wrapper')) {
            oldParent.replaceChild(viewWrapper, this.activeView);
            viewWrapper.appendChild(this.activeView);
            this.viewStack[0].wrapper = viewWrapper;
        }
    }

    _addNewElementObserver() {
        const observer = new MutationObserver(mutationsList => {
            mutationsList.map(entry => {
                if (entry.target != null && this.latestElementAdded != null) {
                    if (
                        Array.from(entry.addedNodes).includes(
                            this.latestElementAdded.parentNode
                        )
                    ) {
                        this._handleElementAddedToDomActions(
                            this.latestElementAdded
                        );
                    }
                    this._overrideAnchorActions(entry.target);
                }
            });
        });
        observer.observe(document.querySelector('body'), {
            attributes: true,
            childList: true,
            subtree: true,
        });
    }

    _handleUrlPathing() {
        let path = window.location.pathname;
        if (path === '/') {
            return;
        }

        if (this.stackedViews) {
            // If the user refreshed the page while staying on a subpage,
            // the viewstack is pushed to localstorage, and retrieved, so the page progression
            // is not lost.
            // In this situation, we handle all the views from the stack first
            if (this.viewStack.length > 1) {
                this._getStackedViewsFromLocalStorage();
            }
            this._transitionToView(this._handleLeadingSlash(path));
        } else {
            let view = this._findViewForRoute(path.split('?')[0]);
            let wrapper = this._navigateToView(view);
            wrapper.classList.remove(this.transitionDirection);
            this.viewStack.push({ ...view, wrapper });
            this.activeView.remove();
            this.activeView = this.viewStack[
                this.viewStack.length - 1
            ].wrapper.firstChild;
        }
    }

    _getStackedViewsFromLocalStorage() {
        let viewStackCopy = [...this.viewStack];
        this.viewStack = [this.viewStack[0]];
        for (let i = 1; i < viewStackCopy.length; i++) {
            this._transitionToView(viewStackCopy[i].path);

            let latestAdditionToStack = this.viewStack[
                this.viewStack.length - 1
            ];
            // The observer doesn't catch these additions, so we invoke it ourselves
            this._handleElementAddedToDomActions(
                latestAdditionToStack.wrapper.firstChild
            );
        }
    }

    async _handleElementAddedToDomActions(newView) {
        let wrapper = newView.parentNode;
        await this._waitForLoadingOff(newView);
        this._removeLoadingIndicator();
        wrapper.classList.remove(this.transitionDirection);
        // Find out if we could do this and the other same kind of operation in one place
        let previousView = this.viewStack[this.viewStack.length - 2];
        if (previousView && previousView.wrapper && !this.stackedViews) {
            previousView.wrapper.classList.add(
                this._getOppositeTransitionDirection()
            );
        }
        setTimeout(() => {
            this.latestElementAdded = null;
            this.transitionInProgress = false;
            wrapper.focus();
            if (!this.stackedViews && this.lastActiveView) {
                this.lastActiveView.remove();
            }
        }, this.transitionSpeed * 1.2 * 1000);
    }

    async _waitForLoadingOff(newView) {
        if (
            !this.waitForLoad ||
            (newView.isLoading === undefined &&
                !newView.getAttribute('isLoading'))
        ) {
            return new Promise(resolve => setTimeout(resolve, 10));
        }
        this._addLoadingIndicator();
        return new Promise(resolve => {
            (function _waitForLoadingOff() {
                if (!newView.isLoading && !newView.getAttribute('isLoading')) {
                    resolve();
                }
                setTimeout(_waitForLoadingOff, 50);
            })();
        });
    }

    _addLoadingIndicator() {
        let holder = document.createElement('div');
        holder.className = 'simplr-router-loading-bar';
        let bar = document.createElement('div');
        bar.className = 'simplr-router-loading-bar-indicator';
        holder.appendChild(bar);
        this.loadingIndicator = holder;
        document.body.appendChild(this.loadingIndicator);
    }

    _removeLoadingIndicator() {
        if (this.loadingIndicator) {
            this.loadingIndicator.remove();
            this.loadingIndicator = null;
        }
    }

    async _overrideAnchorActions(target) {
        setTimeout(() => {
            target.addEventListener('click', e => {
                if (e.target.dataset.hasOwnProperty('simplrRoute')) {
                    e.preventDefault();
                    this._goToView(e.target.getAttribute('href'));
                }
            });
            let allElements = Array.from(target.querySelectorAll('*'));
            allElements.map(elem => {
                // If the queried element contains a shadow root, we recursively apply
                // this method to it
                if (elem.shadowRoot) {
                    this._overrideAnchorActions(elem.shadowRoot);
                }
            });
        }, 0);
    }

    _goToView(view) {
        if (this.transitionInProgress) {
            return;
        }
        let anchorAddress = this._handleLeadingSlash(view);
        let transitionSuccessful = this._transitionToView(anchorAddress);

        if (transitionSuccessful) {
            window.history.pushState(null, '', anchorAddress);
        }
    }

    _overrideReturnAction() {
        window.addEventListener('popstate', () => {
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
            if (this.stackedViews) {
                this._removeStackingView();
            } else {
                this._goToPreviousPage();
            }
            localStorage.setItem(
                'Simplr-Router-ViewStack',
                JSON.stringify(this.viewStack)
            );
        } else {
            window.history.back();
        }
    }

    _removeStackingView() {
        let oldActiveView = this.viewStack.pop();
        oldActiveView.wrapper.classList.add(this.transitionDirection);
        setTimeout(() => {
            oldActiveView.wrapper.remove();
        }, this.transitionSpeed * 1.2 * 1000);
    }

    _goToPreviousPage() {
        let oldActiveView = this.viewStack.pop();
        let newView = this.viewStack[this.viewStack.length - 1];
        this._transitionToView(newView.path, true);

        let oppositeTransitionDirection = this._getOppositeTransitionDirection();
        oldActiveView.wrapper.classList.add(this.transitionDirection);
        newView.wrapper.classList.add(oppositeTransitionDirection);
        setTimeout(() => {
            newView.wrapper.classList.remove(oppositeTransitionDirection);
        }, 10);
        setTimeout(() => {
            oldActiveView.wrapper.remove();
        }, this.transitionSpeed * 1.2 * 1000);
    }

    _navigationPressWasBackwards() {
        return (
            (this.viewStack.length > 1 &&
                window.location.pathname ===
                    this.viewStack[this.viewStack.length - 2].path) ||
            (this.viewStack.length === 1 &&
                window.location.pathname === this.viewStack[0].path)
        );
    }

    _transitionToView(viewToTransitionTo, isPreviousAction) {
        let newView = this._findViewForRoute(viewToTransitionTo.split('?')[0]);

        if (!newView) {
            newView = this._handleNotFoundAction(newView);
            if (newView == null) return false;
        }
        if (
            newView.guard &&
            typeof newView.guard === 'function' &&
            !newView.guard.call()
        ) {
            newView = this._handleForbiddenAction(newView);
            if (newView == null) return false;
        }
        this.transitionInProgress = true;

        let wrapper = this._navigateToView(newView, isPreviousAction);
        if (isPreviousAction) {
            this.activeView = wrapper.querySelector(newView.view);
            this.viewStack[this.viewStack.length - 1].wrapper = wrapper;
        } else {
            this._updateActiveView(newView, wrapper);
        }
        localStorage.setItem(
            'Simplr-Router-ViewStack',
            JSON.stringify(this.viewStack)
        );
        return true;
    }

    _handleNotFoundAction(newView) {
        if (this.notFoundAction) {
            this.notFoundAction.call();
            return null;
        } else {
            newView = this._getNotFoundRoute();
            if (newView == null) {
                throw Error(
                    'Page not found, and a not-found route has not been set.'
                );
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
                throw Error(
                    'Access to page forbidden, and a forbidden route has not been set.'
                );
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

    _navigateToView(route, isPreviousAction) {
        let viewObject = document.createElement(route.view);
        if (route.params) {
            for (let key in route.params) {
                if (route.params.hasOwnProperty(key)) {
                    viewObject.setAttribute(key, route.params[key]);
                }
            }
        }
        let viewWrapper = this._createViewWrapper();
        viewWrapper.classList.add(
            isPreviousAction
                ? this._getOppositeTransitionDirection()
                : this.transitionDirection
        );
        viewWrapper.appendChild(viewObject);

        this.latestElementAdded = viewObject;
        this.body.appendChild(viewWrapper);

        return viewWrapper;
    }

    _createViewWrapper() {
        let viewWrapper = document.createElement('div');
        viewWrapper.setAttribute('tabindex', 0);
        viewWrapper.classList.add('simplr-router-view-wrapper');

        return viewWrapper;
    }

    _getOppositeTransitionDirection() {
        switch (this.transitionDirection) {
            case TransitionDirection.TOP:
                return TransitionDirection.BOTTOM;
            case TransitionDirection.RIGHT:
                return TransitionDirection.LEFT;
            case TransitionDirection.BOTTOM:
                return TransitionDirection.TOP;
            case TransitionDirection.LEFT:
                return TransitionDirection.RIGHT;
        }
    }

    _updateActiveView(route, wrapper) {
        this.lastActiveView = this.activeView.parentNode.className.includes(
            'simplr-router-view-wrapper'
        )
            ? this.activeView.parentNode
            : this.activeView;
        this.activeView = wrapper.querySelector(route.view);
        this.viewStack = [
            ...this.viewStack,
            { view: route.view, wrapper: wrapper, path: route.path },
        ];
    }

    _findViewForRoute(href) {
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
                matchedRoute = this._parseParameters(
                    route,
                    href,
                    hrefParameters
                );
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
        return params.map(p => p.substring(1));
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

        let routePath = this._replaceRouteParamsWithHrefParams(
            route.path,
            hrefParameters,
            routeParameters
        );
        if (routePath === href) {
            let mappedParams = this._mapParameters(
                hrefParameters,
                routeParameters
            );
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

    _createStyles() {
        if (this.useStyles) {
            SimplrRouterStyler.addStyles(this);
        }
    }

    _handleLeadingSlash(path) {
        if (path.substring(0, 1) !== '/') {
            path = '/' + path;
        }
        return path;
    }

    static setTransitionSpeed(speed) {
        if (
            typeof speed == 'number' ||
            (!isNaN(Number(speed)) && typeof Number(speed) == 'number')
        ) {
            this.Router.transitionSpeed = speed;
            this.Router._createStyles();
        } else {
            throw Error(
                `Attempted to set transition speed to ${speed}, but ${speed} is not a viable speed parameter.`
            );
        }
    }

    static setTransitionDirection(transitionDir) {
        if (Object.values(TransitionDirection).includes(transitionDir)) {
            this.Router.transitionDirection = transitionDir;
            this.Router._createStyles();
        } else {
            throw Error(
                `Attempted to set transition direction to ${transitionDir}, but ${transitionDir} is not a preset direction.\nPlease use a preset direction spesified in TransitionDirection-object.`
            );
        }
    }

    static setForbiddenAction(action) {
        this.Router.forbiddenAction = action;
    }

    static setNotFoundAction(action) {
        this.Router.notFoundAction = action;
    }
}
