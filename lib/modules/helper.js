export const getEventPath = (event) => event.path || (event.composedPath && event.composedPath());

/**
 * @augments SimplrRouterNavigationData
 */
export class ForwardsTransitionObject {
    /**
     * @returns {SimplrRouterNavigationData} view
     * @param {SimplrRouterNavigationData} view
     */
    static from(view) {
        return {
            ...view,
            backwards: false,
            initialView: false,
        };
    }
}

export class BackwardsTransitionObject {
    /**
     * @returns {SimplrRouterNavigationData} view
     * @param {SimplrRouterNavigationData} view
     */
    static from(view) {
        return {
            ...view,
            backwards: true,
            initialView: false,
        };
    }
}

export class InitialTransitionObject {
    /**
     * @returns {SimplrRouterNavigationData} view
     * @param {SimplrRouterNavigationData} view
     */
    static from(view) {
        return {
            ...view,
            backwards: false,
            initialView: true,
        };
    }
}

export const updateHistory = (path) => window.history.pushState(null, '', path);
