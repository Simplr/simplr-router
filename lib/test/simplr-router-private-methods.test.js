import SimplrRouter from '../simplr-router';
import MutationObserver from 'mutation-observer';
import { TransitionSpeed } from '../simplr-router-transition-speed';
import { TransitionDirection } from '../simplr-router-transition-direction';
import * as CSSOM from '@babel/core';
import SimplrRouterStyler from '../simplr-router-styler';

const routes = [
    {
        path: '/',
        view: 'app-index',
    },
    {
        path: '/test',
        view: 'test-view',
    },
    {
        path: '/guard',
        view: 'guarded-view',
        guard: () => {
            return false;
        },
    },
    {
        path: '/param/:fooId',
        view: 'foo-view',
    },
];

const newRoutes = [
    {
        path: '/',
        view: 'app-index',
    },
    {
        path: '/test',
        view: 'test-view',
    },
    {
        path: '/guard',
        view: 'guarded-view',
        guard: () => {
            return false;
        },
    },
    {
        path: '/not-found',
        view: 'not-found-view',
    },
    {
        path: '/forbidden',
        view: 'forbidden-view',
    },
];
// MOCKS
global.MutationObserver = MutationObserver;

const mockActiveView = () => {
    let base = document.createElement('app-base');
    base.appendChild(createLink('/'));
    base.appendChild(createLink('/test'));
    base.appendChild(createLink('/guard'));

    return base;
};

const mockNewViewWrapper = () => {
    let base = document.createElement('div');
    base.className = 'simplr-router-wrapper';
    base.appendChild(document.createElement('test-view'));
    return base;
};

const createLink = href => {
    let link = document.createElement('a');
    link.href = href;
    link.setAttribute('data-simplr-route', '');
    return link;
};

test('_handleLeadingSlash should handle leading slash on links', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    let path = 'test';
    expect(router._handleLeadingSlash(path)).toBe(`/${path}`);
});

test('_loadRoutes should throw error if passed null or undefined', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    expect(() => {
        router._loadRoutes(null);
    }).toThrowError();
    expect(() => {
        router._loadRoutes(undefined);
    }).toThrowError();
    expect(() => {
        router._loadRoutes(routes);
    }).not.toThrowError();
});

test('_mapParameters should return url parameters mapped to json object', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    let hrefParams = [12, 123];
    let routeParams = [':id', ':secondId'];

    let mappedParams = router._mapParameters(hrefParams, routeParams);

    expect(mappedParams.id).toBe(hrefParams[0]);
    expect(mappedParams.secondId).toBe(hrefParams[1]);
});

test('_replaceRouteParamsWithHrefParams should replace parameters in route to parameters from url', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    let path = '/foo/:id/bar/:secondId';
    let expectedPath = '/foo/12/bar/123';
    let hrefParams = [12, 123];
    let routeParams = [':id', ':secondId'];

    let newPath = router._replaceRouteParamsWithHrefParams(
        path,
        hrefParams,
        routeParams
    );
    expect(newPath).toBe(expectedPath);
});

test('_parseParameters should return the correct route for path', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    let route = {
        path: '/foo/:id/bar/:secondId',
        view: 'test-view-with-params',
    };
    let hrefParams = [12, 123];
    let path = '/foo/12/bar/123';

    let matchedRoute = router._parseParameters(route, path, hrefParams);
    expect(matchedRoute).not.toBeNull();
});

test("_parseParameters should return null if the amount of parameters in the route and the path don't match", () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    let route = {
        path: '/foo/:id/bar/:secondId/baz/:thirdId',
        view: 'test-view-with-params',
    };
    let hrefParams = [12, 123];
    let path = '/foo/12/bar/123';

    let matchedRoute = router._parseParameters(route, path, hrefParams);
    expect(matchedRoute).toBeNull();
});

test('_extractRouteParameters should extract parameterstring from route', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    let route = '/foo/:id/bar/:secondId';
    let expectedRouteParams = [':id', ':secondId'];

    let routeParams = router._extractRouteParameters(route);
    expect(routeParams).toStrictEqual(expectedRouteParams);
});

test('_extractUrlParameters should extract parameters from route', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    let route = '/foo/12/bar/123';
    let expectedRouteParams = ['12', '123'];

    let routeParams = router._extractUrlParameters(route);
    expect(routeParams).toStrictEqual(expectedRouteParams);
});

test('_findViewForRoute should return a view if view is in routes file', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    let route = routes[1].path;
    let parametrizedRoute = '/param/123';
    expect(router._findViewForRoute(route)).toBe(routes[1]);
    expect(router._findViewForRoute('foobar')).toBeNull();
    expect(router._findViewForRoute(parametrizedRoute).path).toBe(
        routes[3].path.replace(':fooId', 123)
    );
});

test('_updateActiveView should add active view to stack', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    let oldStackLength = router.viewStack.length;
    router._updateActiveView(routes[1], mockNewViewWrapper());
    expect(router.activeView).toStrictEqual(
        document.createElement(routes[1].view)
    );
    expect(router.viewStack.length).toBe(oldStackLength + 1);
});

test('_navigateToView should append view to DOM', () => {
    jest.useFakeTimers();
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    router._navigateToView(routes[1]);
    jest.runOnlyPendingTimers();
    expect(document.body.querySelector(routes[1].view)).not.toBeNull();
});

test('_getForbiddenRoute should return null if /forbidden is not set in routes', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    expect(router._getForbiddenRoute()).toBeNull();

    let secondRouter = new SimplrRouter({
        activeView: mockActiveView(),
        routes: newRoutes,
        useStyles: false,
    });
    secondRouter.init();
    expect(secondRouter._getForbiddenRoute()).not.toBeNull();
});

test('_getNotFoundRoute should return null if /not-found is not set in routes', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    expect(router._getNotFoundRoute()).toBeNull();

    let secondRouter = new SimplrRouter({
        activeView: mockActiveView(),
        routes: newRoutes,
        useStyles: false,
    });
    secondRouter.init();
    expect(secondRouter._getNotFoundRoute()).not.toBeNull();
});

test('_handleForbiddenAction should throw error if not action or view is set', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    expect(() => {
        router._handleForbiddenAction();
    }).toThrowError();
});

test('_handleForbiddenAction should return forbidden-view if view is in routes', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: newRoutes,
        useStyles: false,
    });
    router.init();
    expect(router._handleForbiddenAction()).toBe(newRoutes[4]);
});

test('_handleForbiddenAction should execute forbiddenaction if forbidden action is set', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    let forbiddenAction = jest.fn();
    SimplrRouter.setForbiddenAction(forbiddenAction);
    router._handleForbiddenAction();
    expect(forbiddenAction).toHaveBeenCalled();
});

test('_handleNotFoundAction should throw error if not action or view is set', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    expect(() => {
        router._handleNotFoundAction();
    }).toThrowError();
});

test('_handleNotFoundAction should return not-found-view if view is in routes', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: newRoutes,
        useStyles: false,
    });
    router.init();
    expect(router._handleNotFoundAction()).toBe(newRoutes[3]);
});

test('_handleNotFoundAction should execute not-found-view if not-found action is set', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    let notFoundAction = jest.fn();
    SimplrRouter.setNotFoundAction(notFoundAction);
    router._handleNotFoundAction();
    expect(notFoundAction).toHaveBeenCalled();
});

test('_transitionToView should return false if given unlisted view and not-found action is set', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    SimplrRouter.setNotFoundAction(() => {
        return false;
    });
    expect(router._transitionToView('/foo-bar')).toBeFalsy();
});

test('_transitionToView should throw error if given unlisted view and no not-found action or view is set', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    expect(() => {
        router._transitionToView('/foo-bar');
    }).toThrowError();
});

test('_transitionToView should throw error if guard fails and no forbidden action or view is set', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    expect(() => {
        router._transitionToView('/guard');
    }).toThrowError();
});

test('_transitionToView should return false if guard fails and forbidden action is set', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    SimplrRouter.setForbiddenAction(() => {
        return false;
    });
    expect(router._transitionToView('/guard')).toBeFalsy();
});

test('_transitionToView should return true on a successful transition to a view', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    expect(router._transitionToView('/test')).toBeTruthy();
});

test('_handleBackwardsNavigation removes a view from the stack', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    router._transitionToView(routes[1].path);
    let viewStackSizeBeforeNavigatingBack = router.viewStack.length;
    router._handleBackwardsNavigation();
    expect(router.viewStack.length).toBe(viewStackSizeBeforeNavigatingBack - 1);
});

test('_overrideAnchor should update anchor data attribute accordingly', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();

    let anchor = createLink('/test');

    router._overrideAnchor(anchor);

    expect(anchor.dataset.hasOwnProperty('simplrRoute')).toBeFalsy();
    expect(
        anchor.dataset.hasOwnProperty('simplrRouteInitialized')
    ).toBeTruthy();
});

test('_overrideAnchorActions should update all anchors data attributes accordingly', () => {
    jest.useFakeTimers();
    let mockView = mockActiveView();

    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();

    document.body.innerHTML = '';
    document.body.appendChild(mockView);

    router._overrideAnchorActions(document.body);
    jest.runOnlyPendingTimers();

    let oldDataAnchors = Array.from(
        document.querySelectorAll('[data-simplr-route]')
    );
    let initializedDataAnchors = Array.from(
        document.querySelectorAll('[data-simplr-route-initialized]')
    );

    expect(oldDataAnchors.length).toBe(0);
    expect(initializedDataAnchors.length).toBe(3);
});

test('_handleUrlPathing should add a extra entry to history, if navigating to sub page', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    global.window = Object.create(window);
    const url = 'localhost';
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: '/test',
        },
    });
    let beforeHistoryLength = window.history.length;
    window.location.pathname = 'test'; // Jest only supports hash urls, so we cheat here a bit
    router._handleUrlPathing();
    expect(window.history.length).toBe(beforeHistoryLength + 1);
});

test('Router transition direction should be settable to all 4 directions', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    expect(() => {
        SimplrRouter.setTransitionDirection(TransitionDirection.LEFT);
    }).not.toThrowError();
    expect(() => {
        SimplrRouter.setTransitionDirection(TransitionDirection.RIGHT);
    }).not.toThrowError();
    expect(() => {
        SimplrRouter.setTransitionDirection(TransitionDirection.TOP);
    }).not.toThrowError();
    expect(() => {
        SimplrRouter.setTransitionDirection(TransitionDirection.BOTTOM);
    }).not.toThrowError();
});
