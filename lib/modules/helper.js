export const getEventPath = (event) => event.path || (event.composedPath && event.composedPath());

/**
 * @augments SimplrRouterNavigationData
 */
export class ForwardsTransitionObject {
    /**
     * @returns {import("../types/Shared").SimplrRouterNavigationData} view
     * @param {import("../types/Shared").SimplrRouterNavigationData} view
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
     * @returns {import("../types/Shared").SimplrRouterNavigationData} view
     * @param {import("../types/Shared").SimplrRouterNavigationData} view
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
     * @returns {import("../types/Shared").SimplrRouterNavigationData} view
     * @param {import("../types/Shared").SimplrRouterNavigationData} view
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
