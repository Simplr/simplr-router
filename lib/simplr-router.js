import SimplrRouterStyler from './simplr-router-styler';
import { TransitionDirection } from './simplr-router-transition-direction';
import { TransitionSpeed } from './simplr-router-transition-speed';

export default class SimplrRouter {
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
        this.viewStack = [
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
            options.stackedViews === undefined ? true : options.stackedViews;

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

    _wrapRootView() {
        let viewWrapper = this._createViewWrapper();
        let oldParent = this.activeView.parentNode;
        console.log(oldParent);
        console.log(viewWrapper);
        console.log(this.viewStack);

        if (
            !this.activeView.parentNode.classList.contains(
                'simplr-router-view-wrapper'
            )
        ) {
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
        let splitAtParams = window.location.href.split('?');
        let params = splitAtParams.length > 1 ? splitAtParams[1] : null;
        if (path === '/') {
            return;
        }
        // Set root layer to history stack, so the user can return to the
        // front page if linked to a sub page
        window.history.replaceState({}, '', '/');
        window.history.pushState({}, '', path + (params ? `?${params}` : ''));

        if (this.stackedViews) {
            this._transitionToView(this._handleLeadingSlash(path));
        } else {
            let view = this._findViewForRoute(path.split('?')[0]);
            let wrapper = this._navigateToView(view);
            wrapper.classList.remove(this.transitionDirection);
            let baseView = this.viewStack.shift();
            this.viewStack.push({ ...view, wrapper });
            baseView.wrapper.remove();
            this.activeView = this.viewStack[0].wrapper.firstChild;
        }
        document.querySelector('body').click();
    }

    async _handleElementAddedToDomActions(newView) {
        let wrapper = newView.parentNode;
        await this._waitForLoadingOff(newView);
        this._removeLoadingIndicator();
        wrapper.classList.remove(this.transitionDirection);
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
        if (!this.waitForLoad || newView.isLoading === undefined) {
            return new Promise(resolve => setTimeout(resolve, 10));
        }
        this._addLoadingIndicator();
        return new Promise(resolve => {
            (function _waitForLoadingOff() {
                if (!newView.isLoading) {
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

    _overrideAnchorActions(target) {
        setTimeout(() => {
            let allElements = Array.from(target.querySelectorAll('*'));
            allElements.map(elem => {
                // If the queried element is a anchor element, we override it
                if (elem.nodeName === 'A') {
                    this._overrideAnchor(elem);
                    return;
                }
                // If the queried element could contain a anchor element, we query anchors
                // inside it, and override them
                elem.querySelectorAll('a').forEach(anchor => {
                    this._overrideAnchor(anchor);
                });

                // If the queried element contains a shadow root, we recursively apply
                // this method to it
                if (elem.shadowRoot) {
                    this._overrideAnchorActions(elem.shadowRoot);
                }
            });
        }, 0);
    }

    _overrideAnchor(anchor) {
        if (!anchor.dataset.hasOwnProperty('simplrRoute')) {
            return;
        }
        anchor.addEventListener('click', e => {
            e.preventDefault();
            this._goToView(anchor.getAttribute('href'));
        });
        anchor.removeAttribute('data-simplr-route');
        anchor.setAttribute('data-simplr-route-initialized', '');
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
        window.history.pushState({}, '');
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
