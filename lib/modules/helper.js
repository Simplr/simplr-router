export const getEventPath = (event) => event.path || (event.composedPath && event.composedPath());

export class ForwardsTransitionObject {
    constructor(view) {
        this.view = view;
        this.backwards = false;
        this.initialView = false;
    }
}

export class BackwardsTransitionObject {
    constructor(view) {
        this.view = view;
        this.backwards = true;
        this.initialView = false;
    }
}

export class InitialTransitionObject {
    constructor(view) {
        this.view = view;
        this.backwards = false;
        this.initialView = true;
    }
}
