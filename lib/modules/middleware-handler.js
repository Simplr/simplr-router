import SimplrRouterMiddleware from './middleware.js';

export default class MiddlewareHandler {
    constructor() {
        this.middlewares = [];
        // If a middleware wants to override the way a view is added to the DOM,
        // for example in a React project, this function will point to the new implementation in the
        // middleware provided.
        this.addViewToContainerOverride = null; // Set this to point to middleware function if one is defined
    }

    add(middlewareClass) {
        const isSuitableMiddleware = middlewareClass instanceof SimplrRouterMiddleware;
        if (!isSuitableMiddleware)
            throw Error(
                "Middleware class doesn't derive from the SimplrRouterMiddleware -class and thus can't be used"
            );

        const functions = Object.getOwnPropertyNames(Object.getPrototypeOf(middlewareClass));
        const overridesAddToView = functions.includes('addViewToContainerOverride');
        if (overridesAddToView) {
            if (!this.overridesAddToView) this.addViewToContainerOverride = middlewareClass.addViewToContainerOverride;
            else throw Error('A Middleware is already overriding the addViewToContainerOverride -function');
        }
        this.middlewares.push(middlewareClass);
    }

    applyNavigatingMiddleware(viewObject) {
        this.middlewares.forEach((mw) => {
            viewObject = mw.routerNavigating(viewObject);
        });
        return viewObject;
    }

    applyNavigationCompleteMiddleware(container) {
        this.middlewares.forEach((mw) => {
            mw.routerNavigationComplete(container);
        });
    }

    applyViewAddedToDOMMiddleware(container) {
        this.middlewares.forEach((mw) => {
            mw.newViewAddedToDOM(container);
        });
    }
}
