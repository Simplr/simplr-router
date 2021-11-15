declare module "modules/simplr-router-container" {
    export function loadContainerStyles(target?: HTMLElement, transitionSpeed?: number): void;
    export const SimplrRouterContainerStyles: "\n            html, body {\n                overflow-x: hidden;\n            }\n            simplr-router-container { \n                display: block;\n                width: 100%; \n                height: 100%; \n                padding: 0;\n                margin: 0;\n                position: absolute;\n                top: 0;\n                left: 0;\n                background: #FFFFFF;\n                overflow-y: auto;\n                transition: linear var(--transition-speed, 0ms) 0s;\n            }\n            simplr-router-container[leaving-view] {\n                background: #FFFFFE;\n            }\n\n            simplr-router-container[entering-view] {\n                background: #FFFFFE;\n            }\n            ";
    export class SimplrRouterContainer extends HTMLElement {
        /**
         * @param {number} transitionSpeed
         */
        static initialize(transitionSpeed: number): void;
        transitionSpeed: number;
        previousView: any;
        navigationCompleteCallback: any;
        connectedCallback(): void;
        transition(): void;
        /**
         * @param {string} direction
         */
        transitionOut(direction: string): void;
    }
}
declare module "modules/builder" {
    export class Builder {
        /**
         * @param {SimplrRouterNavigationData} view
         *
         * @returns {Promise<HTMLElement>}
         */
        createComponentElement(view: SimplrRouterNavigationData): Promise<HTMLElement>;
        /**
         * @param {SimplrRouterNavigationData} viewObject
         * @param {boolean} movingIn
         * @param {number} transitionSpeed
         */
        createViewContainer(viewObject: SimplrRouterNavigationData, movingIn: boolean, transitionSpeed: number): SimplrRouterContainer;
        /**
         * @param {SimplrRouterNavigationData} view
         * @param {HTMLElement} component
         */
        _buildSlotElements(view: SimplrRouterNavigationData, component: HTMLElement): void;
        _getSlotElementProperties(): string[];
        /**
         * @param {boolean} transitionBackwards
         * @param {boolean} movingIn
         */
        _determineMovementDirection(transitionBackwards: boolean, movingIn: boolean): "leaving-view" | "entering-view";
    }
    import { SimplrRouterContainer } from "modules/simplr-router-container";
}
declare module "modules/config" {
    export class Config {
        /**
         * @param {SimplrRouterOptions} options
         */
        constructor(options: SimplrRouterOptions);
        /**
         * @param {SimplrRouterOptions} options
         */
        _parseOptions(options: SimplrRouterOptions): void;
        routes: SimplrRoute[];
        rootPath: string;
        debugging: boolean;
        transitionSpeed: number;
        notFoundAction: Function;
        forbiddenAction: Function;
    }
}
declare module "modules/deepquery" {
    /**
     * @returns {Element}
     * */
    export function findOutlet(): Element;
    /**
     * @param {string} target
     * @param {Element | ShadowRoot} [dom]
     *
     * @returns {Element}
     */
    export function deepQuery(target: string, dom?: Element | ShadowRoot): Element;
}
declare module "modules/dispatcher" {
    export function sendTransitionStartEvent(view: any): void;
    export function sendTransitionFinishEvent(): void;
    export function sendRouterInitializedEvent(routes: any): void;
}
declare module "modules/helper" {
    export function getEventPath(event: any): any;
    /**
     * @augments SimplrRouterNavigationData
     */
    export class ForwardsTransitionObject {
        /**
         * @returns {SimplrRouterNavigationData} view
         * @param {SimplrRouterNavigationData} view
         */
        static from(view: SimplrRouterNavigationData): SimplrRouterNavigationData;
    }
    export class BackwardsTransitionObject {
        /**
         * @returns {SimplrRouterNavigationData} view
         * @param {SimplrRouterNavigationData} view
         */
        static from(view: SimplrRouterNavigationData): SimplrRouterNavigationData;
    }
    export class InitialTransitionObject {
        /**
         * @returns {SimplrRouterNavigationData} view
         * @param {SimplrRouterNavigationData} view
         */
        static from(view: SimplrRouterNavigationData): SimplrRouterNavigationData;
    }
    export function updateHistory(path: any): void;
}
declare module "modules/middleware-handler" {
    export class MiddlewareHandler {
        middlewares: any[];
        addViewToContainerOverride: any;
        componentCreationOverride: any;
        /**
         * @param {{ addViewToContainerOverride: Function; createComponentOverride: Function }} middlewareClass
         */
        add(middlewareClass: {
            addViewToContainerOverride: Function;
            createComponentOverride: Function;
        }): void;
        /**
         * @param {SimplrRouterNavigationData} viewObject
         */
        applyNavigatingMiddleware(viewObject: SimplrRouterNavigationData): SimplrRouterNavigationData;
        /**
         * @param {HTMLElement | ShadowRoot} container
         */
        applyNavigationCompleteMiddleware(container: HTMLElement | ShadowRoot): void;
        /**
         * @param {import("./simplr-router-container").SimplrRouterContainer} container
         */
        applyViewAddedToDOMMiddleware(container: import("./simplr-router-container").SimplrRouterContainer): void;
    }
}
declare module "modules/parser" {
    /**
     * Instead of parsing through the paths in runtime on every request,
     * we map the routes into 2 separate groups: Ones with static routes and
     * ones with dynamic routes (routes with e.g. :id).
     *
     * This will make it faster to look up the routes and find the correct ones.
     *
     * TODO: Consider having them as some sort of maps/weakmaps for faster lookup
     * */
    export class Parser {
        /**
         * @param {import("./config").Config} config
         */
        constructor(config: import("./config").Config);
        rootPath: string;
        /**
         * @param {SimplrRoute[]} routes
         */
        parseRoutes(routes: SimplrRoute[]): {
            dynamicRoutes: any[];
            staticRoutes: any[];
        };
        /**
         * @param {SimplrRoute[]} routes
         * @param {SimplrRouterNavigationData[]} staticRoutes
         * @param {SimplrRouterNavigationData[]} dynamicRoutes
         * @param {SimplrRouterNavigationData} [parent]
         * @param {boolean} [isNested = false]
         */
        _iterateRoutes(routes: SimplrRoute[], staticRoutes: SimplrRouterNavigationData[], dynamicRoutes: SimplrRouterNavigationData[], parent?: SimplrRouterNavigationData, isNested?: boolean): void;
        /**
         * @param {string} partOne
         * @param {string} partTwo
         */
        _needsSlashBetween(partOne: string, partTwo: string): boolean;
        /**
         * @returns { string  }
         * */
        parseViewFromUrl(): string;
        /**
         * @param {string} path
         * @param {boolean} [addRootPath]
         */
        buildFullPath(path: string, addRootPath?: boolean): string;
        /**
         * When searching for a route, we build a needle to find from
         * the haystack of routes. If the app has a rootPath set up,
         * we append that to the route to match the full route and
         * update the history accordingly
         *
         * @param {string} path
         */
        buildNeedle(path: string): string;
        /**
         * @param {string} path
         */
        handleLeadingAndTrailingSlash(path: string): string;
        /**
         * @param {string} route
         */
        splitRouteParts(route: string): string[];
        /**
         * @param {SimplrRouterNavigationData} routeObject
         * @param {string[]} urlRouteParts
         */
        mapParametersForRoute(routeObject: SimplrRouterNavigationData, urlRouteParts: string[]): void;
        /**
         * @param {string} pathA
         * @param {string} pathB
         */
        _getRouteSeparator(pathA: string, pathB: string): "" | "/";
        /**
         * @param {string} path
         */
        _addRootPath(path: string): string;
    }
}
declare module "modules/router" {
    export class Router {
        /**
         * @param {import("./config").Config} config
         */
        constructor(config: import("./config").Config);
        config: import("modules/config").Config;
        parser: Parser;
        builder: Builder;
        observer: Observer;
        middlewareHandler: MiddlewareHandler;
        /** @type SimplrRouterNavigationData */
        currentView: SimplrRouterNavigationData;
        staticRoutes: any[];
        dynamicRoutes: any[];
        notFoundAction: Function;
        forbiddenAction: Function;
        transitionInProgress: boolean;
        /**
         * @returns { ObserverFunctions  }
         * */
        _getObserverFunctions(): ObserverFunctions;
        get routes(): any[];
        /**
         * @param {SimplrRouterNavigationData} viewObject
         * @param {string} historyPath
         */
        changeView(viewObject: SimplrRouterNavigationData, historyPath: string): Promise<void>;
        /**
         * @param {SimplrRouterNavigationData} view
         * @returns {Promise<HTMLElement>}
         */
        _createComponent(view: SimplrRouterNavigationData): Promise<HTMLElement>;
        getBreadcrumbs(): SimplrRouterBreadcrumb[];
        /**
         * @param {any} middlewareClass
         */
        addMiddleware(middlewareClass: any): void;
        /**
         * @param {HTMLElement} viewComponent
         * @param {SimplrRouterNavigationData} viewObject
         * @returns {SimplrRouterContainer}
         */
        _wrapViewWithContainer(viewComponent: HTMLElement, viewObject: SimplrRouterNavigationData): SimplrRouterContainer;
        /**
         * @param {HTMLElement} viewComponent
         * @param {SimplrRouterContainer} container
         */
        _addViewToContainer(viewComponent: HTMLElement, container: SimplrRouterContainer): void;
        /**
         * @param {HTMLElement | ShadowRoot} container
         */
        _handleNavigationComplete(container: HTMLElement | ShadowRoot): void;
        /**
         * @param {HTMLElement | ShadowRoot} container
         * @param {string} id
         */
        _findScrollTarget(container: HTMLElement | ShadowRoot, id: string): Element;
        /**
         * @param {HTMLElement} component
         * @param {SimplrRouterNavigationData} viewObject
         */
        _pushNewViewIntoDom(component: HTMLElement, viewObject: SimplrRouterNavigationData): void;
        activeView: SimplrRouterContainer;
        handleUrlPathing(): void;
        /**
         * @param {string} name
         */
        findRouteByName(name: string): any;
        /**
         * @param {string} route
         */
        findViewForRoute(route: string): any;
        /**
         * @param {SimplrRouterNavigationData} viewObject
         */
        _handleRedirect(viewObject: SimplrRouterNavigationData): void;
        /**
         * @param {SimplrRouterNavigationData} newView
         */
        _checkViewValidity(newView: SimplrRouterNavigationData): any;
        /**
         * @param {SimplrRouterNavigationData} view
         */
        _guardFails(view: SimplrRouterNavigationData): Promise<boolean>;
        _getViewFromUrl(): any;
        /**
         * @param {string} needle
         */
        _findViewFromStaticRoutes(needle: string): any;
        /**
         * @param {any} needle
         */
        _findViewFromDynamicRoutes(needle: any): any;
        _handleNotFoundAction(): void;
        _handleForbiddenAction(): void;
    }
    import { Parser } from "modules/parser";
    import { Builder } from "modules/builder";
    import { Observer } from "modules/observer";
    import { MiddlewareHandler } from "modules/middleware-handler";
    import { SimplrRouterContainer } from "modules/simplr-router-container";
}
declare module "modules/simplr-router-outlet" {
    export function loadOutletStyles(target?: HTMLElement, transitionSpeed?: number): void;
    export const SimplrRouterOutletStyles: "\n            html, body {\n                overflow-x: hidden;\n            }\n            simplr-router-container { \n                display: block;\n                width: 100%; \n                height: 100%; \n                padding: 0;\n                position: absolute;\n                top: 0;\n                left: 0;\n                margin: 0;\n                background: #FFFFFF;\n                overflow-y: auto;\n                transition: linear var(--transition-speed, 0ms) 0s;\n            }\n            simplr-router-container[leaving-view] {\n                background: #FFFFFE;\n            }\n\n            simplr-router-container[entering-view] {\n                background: #FFFFFE;\n            }\n            simplr-router-outlet {\n                width: 100%;\n                height: 100%;\n                display: flex;\n                position: relative;\n            }\n            ";
    export class SimplrRouterOutlet extends HTMLElement {
        /**
         * @param {number} transitionSpeed
         */
        static initialize(transitionSpeed: number): void;
        connectedCallback(): void;
    }
    export namespace SimplrRouterOutlet {
        const transitionSpeed: number;
    }
}
declare module "simplr-router" {
    /**
     * @class SimplrRouter
     * */
    export class SimplrRouter {
        /**
         * @param {SimplrRouterOptions} options
         */
        constructor(options: SimplrRouterOptions);
        config: Config;
        router: Router;
        routes: any[];
        init(): void;
        /**
         * @param {ChangeViewObject} changeViewObject
         * */
        changeView({ path, name, hash }: ChangeViewObject): void;
        /**
         * @param {any} middlewareClass
         */
        use(middlewareClass: any): void;
        getBreadcrumbs(): SimplrRouterBreadcrumb[];
        getCurrentView(): SimplrRouterNavigationData;
    }
    export namespace SimplrRouter {
        const _instance: any;
    }
    export function changeView(changeViewObject: ChangeViewObject): any;
    export function getBreadcrumbs(): any;
    export function getCurrentView(): any;
    import { Config } from "modules/config";
    import { Router } from "modules/router";
}
declare module "modules/observer" {
    export class Observer {
        /**
         * @param {ObserverFunctions} functions
         */
        constructor(functions: ObserverFunctions);
        /**
         * @param {ObserverFunctions} functions
         */
        _setAnchorListener(functions: ObserverFunctions): void;
        /**
         * @param {ObserverFunctions} functions
         */
        _setReturnActionListeners(functions: ObserverFunctions): void;
    }
}
type ChangeViewObject = {
    path?: string;
    name?: string;
    hash?: string;
};
type SimplrRouterNavigationDataProps = {
    /**
     * The original determined path of the route
     */
    realPath?: string;
    /**
     * String parts of the parsed route
     */
    parts?: string[];
    /**
     * Dynamic parts of the route mapped
     */
    params?: {
        [x: string]: string;
    };
    /**
     * If the navigation is being done backwards in history
     */
    backwards: boolean;
    /**
     * If this is the initial view loaded first on load instead of navigation
     */
    initialView: boolean;
    /**
     * The breadcrumbs to the current path
     */
    crumbs: SimplrRouterBreadcrumb[];
    /**
     * The parent view of a nested route
     */
    nestedParent?: SimplrRouterNavigationData;
};
type SimplrRouterNavigationData = SimplrRoute & SimplrRouterNavigationDataProps;
type SimplrRouterBreadcrumb = {
    path: string;
    name?: string;
    params?: {
        [x: string]: string;
    };
};
type ObserverFunctions = {
    findViewForRoute: Function;
    changeView: Function;
    getViewFromUrl: Function;
};
type SimplrRoute = {
    /**
     * The URL path for the route
     */
    path: string;
    /**
     * The view component name for the route
     */
    component?: string;
    /**
     * Name of the view route
     */
    name?: string;
    /**
     * An import function for lazy loading. e.g. () => import("./my-view.js")
     */
    import?: Function;
    /**
     * A guard function to check view access
     */
    guard?: Function;
    /**
     * An array of subroutes that inherit paths from the parent route
     */
    routes?: SimplrRoute[];
    /**
     * An array of nested routes that are rendered inside a nested router outlet
     */
    children?: SimplrRoute[];
    /**
     * An array of slots to append to the view component
     */
    slots?: {
        [x: string]: string | Function;
    }[];
    /**
     * RegExp pattern to match dynamic route keys
     */
    pattern?: {
        [x: string]: string;
    };
    /**
     * Path to redirect to
     */
    redirect?: string | {
        name: string;
    };
    /**
     * If navigation from this page should be prevented with a confirmation dialog
     */
    preventUnload?: boolean;
};
type SimplrRouterOptions = {
    /**
     * Routes provided for the Simplr Router.
     */
    routes: SimplrRoute[];
    /**
     * Root path of the router. If the root is not the origin of the host.
     */
    rootPath: string;
    /**
     * Transition speed of view transitions in milliseconds.
     */
    transitionSpeed?: number;
    /**
     * Action triggered when a view is not found.
     */
    notFoundAction?: Function;
    /**
     * Action triggered when access to a view is forbidden by a guard function.
     */
    forbiddenAction?: Function;
    /**
     * Enable debugging
     */
    debugging?: boolean;
};
