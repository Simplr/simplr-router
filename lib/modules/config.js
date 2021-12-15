export class Config {
    /**
     * @param {import("../types/SimplrRouterOptions").SimplrRouterOptions} options
     */
    constructor(options) {
        this._parseOptions(options);
    }

    /**
     * @param {import("../types/SimplrRouterOptions").SimplrRouterOptions} options
     */
    _parseOptions(options) {
        this.routes = options.routes;
        this.rootPath = options.rootPath;
        this.debugging = options.debugging;
        this.transitionSpeed = options.transitionSpeed == null ? 0 : options.transitionSpeed;
        this.notFoundAction = options.notFoundAction;
        this.forbiddenAction = options.forbiddenAction;
    }
}
