export default class MiddlewareHandler {
    constructor() {
        this.middlewares = [];
    }

    add(middlewareClass) {
        this.middlewares.push(middlewareClass);
    }

    applyNavigatingMiddleware(viewObject) {
        console.log('Apply navigating middleware');
        return viewObject;
    }

    applyNavigationCompleteMiddleware() {
        console.log('Apply navigation complete middleware');
    }

    applyViewAddedToDOMMiddleware(container) {
        console.log('Apply view added to dom middleware');
    }
}
