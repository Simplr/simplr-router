export class Config {
    /**
     * @param {SimplrRouterOptions} options
     */
    constructor(options) {
        this._parseOptions(options);
    }

    /**
     * @param {SimplrRouterOptions} options
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
