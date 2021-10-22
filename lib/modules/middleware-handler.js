export class MiddlewareHandler {
    constructor() {
        this.middlewares = [];
        // If a middleware wants to override the way a view is added to the DOM,
        // for example in a React project, this function will point to the new implementation in the
        // middleware provided.
        this.addViewToContainerOverride = null; // Set this to point to middleware function if one is defined
        this.componentCreationOverride = null;
    }

    /**
     * @param {{ addViewToContainerOverride: Function; createComponentOverride: Function }} middlewareClass
     */
    add(middlewareClass) {
        const functions = Object.getOwnPropertyNames(Object.getPrototypeOf(middlewareClass));

        const overridesAddToView = functions.includes('addViewToContainerOverride');
        if (overridesAddToView) {
            if (!this.addViewToContainerOverride)
                this.addViewToContainerOverride = middlewareClass.addViewToContainerOverride.bind(middlewareClass);
            else throw Error('A Middleware is already overriding the addViewToContainerOverride -function');
        }

        const overridesComponentCreation = functions.includes('createComponentOverride');
        if (overridesComponentCreation) {
            if (!this.componentCreationOverride)
                this.componentCreationOverride = middlewareClass.createComponentOverride.bind(middlewareClass);
            else throw Error('A Middleware is already overriding the createComponentOverride -function');
        }

        this.middlewares.push(middlewareClass);
    }

    /**
     * @param {SimplrRouterNavigationData} viewObject
     */
    applyNavigatingMiddleware(viewObject) {
        this.middlewares.forEach((mw) => {
            if (mw.routerNavigating) {
                viewObject = mw.routerNavigating(viewObject);
            }
        });
        return viewObject;
    }

    /**
     * @param {HTMLElement | ShadowRoot} container
     */
    applyNavigationCompleteMiddleware(container) {
        this.middlewares.forEach((mw) => {
            if (mw.routerNavigationComplete) {
                mw.routerNavigationComplete(container);
            }
        });
    }

    /**
     * @param {import("./simplr-router-container").SimplrRouterContainer} container
     */
    applyViewAddedToDOMMiddleware(container) {
        this.middlewares.forEach((mw) => {
            if (mw.newViewAddedToDOM) {
                mw.newViewAddedToDOM(container);
            }
        });
    }
}
