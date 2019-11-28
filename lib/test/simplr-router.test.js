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

const mockActiveView = () => {
    let base = document.createElement('app-base');
    base.appendChild(createLink('/'));
    base.appendChild(createLink('/test'));
    base.appendChild(createLink('/guard'));

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
        SimplrRouter.init();
    }).toThrowError(
        'Cannot initialize SimplrRouter because active view is null.'
    );
});

test('Throws on absence of routes as second parameter', () => {
    expect(() => {
        SimplrRouter.init(mockActiveView());
    }).toThrowError(/No routes passed during initialization./);
});

test('Should build router successfully', () => {
    expect(() => {
        SimplrRouter.init(mockActiveView(), routes, false);
    }).toBeTruthy();
});

test('Should have Router set up after successful init', () => {
    SimplrRouter.init(mockActiveView(), routes, false);
    expect(SimplrRouter.Router).not.toBeNull();
});

test('Should have routes set up on successful router init', () => {
    SimplrRouter.init(mockActiveView(), routes, false);
    expect(SimplrRouter.Router.Routes).not.toBeNull();
    expect(SimplrRouter.Router.Routes.length).toBe(routes.length);
});

test('Simplr Router Links should have updated data attributes after initialization', () => {
    jest.useFakeTimers();

    let view = mockActiveView();
    document.body.appendChild(view);
    SimplrRouter.init(view, routes, false);
    jest.runOnlyPendingTimers();

    let oldDataAttributeElements = Array.from(
        document.body.querySelectorAll('[data-simplr-route]')
    );
    let initializedDataAttributeElements = Array.from(
        document.body.querySelectorAll('[data-simplr-route-initialized]')
    );

    expect(oldDataAttributeElements.length).toBe(0);
    expect(initializedDataAttributeElements.length).toBe(routes.length);
});

test('SetTransitionSpeed should throw on invalid value', () => {
    SimplrRouter.init(mockActiveView(), routes, false);
    expect(() => {
        SimplrRouter.setTransitionSpeed('abc');
    }).toThrowError();
});

test('SetTransitionSpeed should not throw on numeric value', () => {
    SimplrRouter.init(mockActiveView(), routes, false);
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
    SimplrRouter.init(mockActiveView(), routes, false);
    expect(() => {
        SimplrRouter.setTransitionDirection('abc');
    }).toThrowError();
});

test('SetTransitionDirection should not throw on TransitionDirection value', () => {
    SimplrRouter.init(mockActiveView(), routes, false);
    expect(() => {
        SimplrRouter.setTransitionDirection(TransitionDirection.LEFT);
    }).not.toThrowError();
});

test('Should append Simplr Router wrapper on anchor click', () => {
    SimplrRouter.init(mockActiveView(), routes, false);
    document.body.querySelector('[data-simplr-route-initialized]').click();
    expect(
        document.body.querySelector('.simplr-router-view-wrapper')
    ).not.toBeNull();
});

test('Forbidden action should be settable', () => {
    SimplrRouter.init(mockActiveView(), routes, false);
    let forbiddenAction = () => {
        console.log('FORBIDDEN');
    };
    SimplrRouter.setForbiddenAction(forbiddenAction);
    expect(SimplrRouter.Router.forbiddenAction).toBe(forbiddenAction);
});

test('Not Found action should be settable', () => {
    SimplrRouter.init(mockActiveView(), routes, false);
    let notFoundAction = () => {
        console.log('NOT FOUND');
    };
    SimplrRouter.setNotFoundAction(notFoundAction);
    expect(SimplrRouter.Router.notFoundAction).toBe(notFoundAction);
});

test('Router should be able to load styles', () => {
    expect(() => {
        SimplrRouter.init(mockActiveView(), routes, true);
    }).not.toThrowError();
});
