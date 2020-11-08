export const getEventPath = (event) => event.path || (event.composedPath && event.composedPath());

export class ForwardsTransitionObject {
    constructor(view) {
        Object.assign(this, {
            view,
            backwards: false,
            initialView: false,
        });
    }
}

export class BackwardsTransitionObject {
    constructor(view) {
        Object.assign(this, {
            view,
            backwards: true,
            initialView: false,
        });
    }
}

export class InitialTransitionObject {
    constructor(view) {
        Object.assign(this, {
            view,
            backwards: false,
            initialView: true,
        });
    }
}

export const updateHistory = (path) => window.history.pushState(null, '', path);
