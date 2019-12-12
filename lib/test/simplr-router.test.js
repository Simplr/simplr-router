import SimplrRouter from '../simplr-router';
import MutationObserver from 'mutation-observer';
import { TransitionSpeed } from '../simplr-router-transition-speed';
import { TransitionDirection } from '../simplr-router-transition-direction';

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
];

// MOCKS
global.MutationObserver = MutationObserver;

beforeEach(() => {
    global.performance.getEntriesByType = jest.fn();
    global.performance.getEntriesByType.mockReturnValue([
        { type: 'navigation' },
    ]);
});

const mockActiveView = () => {
    let base = document.createElement('app-base');
    base.appendChild(createLink('/'));
    base.appendChild(createLink('/test'));
    base.appendChild(createLink('/guard'));
    document.body.appendChild(base);

    return base;
};

const createLink = href => {
    let link = document.createElement('a');
    link.href = href;
    link.setAttribute('data-simplr-route', '');
    return link;
};

test('Throws on absence of Active view as first parameter', () => {
    expect(() => {
        let router = new SimplrRouter();
        router.init();
    }).toThrowError('Cannot initialize SimplrRouter without options.');
});

test('Throws on absence of routes as second parameter', () => {
    expect(() => {
        let router = new SimplrRouter({ activeView: mockActiveView() });
        router.init();
    }).toThrowError(/No routes passed during initialization./);
});

test('Should build router successfully', () => {
    expect(() => {
        let router = new SimplrRouter({
            activeView: mockActiveView(),
            routes: routes,
            useStyles: false,
        });
        router.init();
    }).toBeTruthy();
});

test('Should have Router set up after successful init', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    expect(router).not.toBeNull();
});

test('Should have routes set up on successful router init', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    expect(router.Routes).not.toBeNull();
    expect(router.Routes.length).toBe(routes.length);
});

test('SetTransitionSpeed should throw on invalid value', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    expect(() => {
        SimplrRouter.setTransitionSpeed('abc');
    }).toThrowError();
});

test('SetTransitionSpeed should not throw on numeric value', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    expect(() => {
        SimplrRouter.setTransitionSpeed(0.2);
    }).not.toThrowError();
    expect(() => {
        SimplrRouter.setTransitionSpeed(TransitionSpeed.SLOW);
    }).not.toThrowError();
    expect(() => {
        SimplrRouter.setTransitionSpeed('0.5');
    }).not.toThrowError();
});

test('SetTransitionDirection should throw on invalid value', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    expect(() => {
        SimplrRouter.setTransitionDirection('abc');
    }).toThrowError();
});

test('SetTransitionDirection should not throw on TransitionDirection value', () => {
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
        SimplrRouter.setTransitionDirection(TransitionDirection.TOP);
    }).not.toThrowError();
    expect(() => {
        SimplrRouter.setTransitionDirection(TransitionDirection.RIGHT);
    }).not.toThrowError();
    expect(() => {
        SimplrRouter.setTransitionDirection(TransitionDirection.BOTTOM);
    }).not.toThrowError();
});

test('Should append Simplr Router wrapper on anchor click', () => {
    jest.useFakeTimers();
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    router.activeView.querySelector('[data-simplr-route]').click();
    jest.runOnlyPendingTimers();
    expect(
        document.body.querySelector('.simplr-router-view-wrapper')
    ).not.toBeNull();
});

test('Forbidden action should be settable', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    let forbiddenAction = () => {
        console.log('FORBIDDEN');
    };
    SimplrRouter.setForbiddenAction(forbiddenAction);
    expect(router.forbiddenAction).toBe(forbiddenAction);
});

test('Not Found action should be settable', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: false,
    });
    router.init();
    let notFoundAction = () => {
        console.log('NOT FOUND');
    };
    SimplrRouter.setNotFoundAction(notFoundAction);
    expect(router.notFoundAction).toBe(notFoundAction);
});

test('Router should be able to load styles', () => {
    expect(() => {
        let router = new SimplrRouter({
            activeView: mockActiveView(),
            routes: routes,
            useStyles: true,
        });
        router.init();
    }).not.toThrowError();
});

test('Use styles should be settable by options', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
        useStyles: true,
    });
    router.init();
    expect(router.useStyles).toBe(true);
});

test('Use styles should default to true', () => {
    let router = new SimplrRouter({
        activeView: mockActiveView(),
        routes: routes,
    });
    router.init();
    expect(router.useStyles).toBe(true);
});
