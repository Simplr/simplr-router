import SimplrRouterStyler from './simplr-router-styler';
import { TransitionDirection } from './simplr-router-transition-direction';
import { TransitionSpeed } from './simplr-router-transition-speed';

export default class SimplrRouter {
    constructor(options) {
        this.debugging = options.debugging;
        if (this.debugging) {
            console.info('Initializing Simplr Router...');
        }

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

        this.transitionInProgress = false;
        this.latestElementAdded = null;

        if (this.debugging) {
            console.info('Router initialized');
        }
    }

    init() {
        this._loadRoutes(this.routes);
        this._addNewElementObserver();
        this._overrideAnchorActions(document.querySelector('body'));
        this._overrideReturnAction();

        this._createStyles();

        this._handleUrlPathing();
        SimplrRouter.Router = this;
    }

    static navigateToPath(path) {
        if (SimplrRouter.Router) {
            SimplrRouter.Router._goToView(path);
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
                        ).then(() => {
                            this.latestElementAdded = null;
                            this.transitionInProgress = false;
                        });
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

        this._transitionToView(this._handleLeadingSlash(path));
        document.querySelector('body').click();
    }

    async _handleElementAddedToDomActions(newView) {
        let wrapper = newView.parentNode;
        await this._waitForLoadingOff(newView);
        wrapper.addEventListener('animationend', () => {
            console.log('Animation end');
        });
        wrapper.classList.remove(this.transitionDirection);
    }

    async _waitForLoadingOff(newView) {
        if (!this.waitForLoad || newView.isLoading === undefined) {
            return new Promise(resolve => setTimeout(resolve, 10));
        }
        return new Promise(resolve => {
            (function _waitForLoadingOff() {
                if (!newView.isLoading) resolve();
                setTimeout(_waitForLoadingOff, 50);
            })();
        });
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
        return (
            (this.viewStack.length > 1 &&
                window.location.pathname ===
                    this.viewStack[this.viewStack.length - 2].path) ||
            (this.viewStack.length === 1 &&
                window.location.pathname === this.viewStack[0].path)
        );
    }

    _transitionToView(viewToTransitionTo) {
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

        let wrapper = this._navigateToView(newView);
        this._updateActiveView(newView, wrapper);
        /*setTimeout(() => {
            this.transitionInProgress = false;
            wrapper.focus();
        }, this.transitionSpeed* 1000);*/
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

    _navigateToView(route) {
        let viewObject = document.createElement(route.view);
        if (route.params) {
            for (let key in route.params) {
                if (route.params.hasOwnProperty(key)) {
                    viewObject.setAttribute(key, route.params[key]);
                }
            }
        }
        let viewWrapper = document.createElement('div');
        viewWrapper.setAttribute('tabindex', 0);
        viewWrapper.classList.add('simplr-router-view-wrapper');
        viewWrapper.classList.add(this.transitionDirection);
        viewWrapper.appendChild(viewObject);

        this.latestElementAdded = viewObject;
        this.body.appendChild(viewWrapper);

        return viewWrapper;
    }

    _updateActiveView(route, wrapper) {
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
