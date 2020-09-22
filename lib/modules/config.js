export default class Config {
    constructor(options) {
        this._parseOptions(options);
    }

    _parseOptions(options) {
        this.routes = options.routes;
        this.rootPath = options.rootPath;
        this.debugging = options.debugging;
        this.transitionSpeed = options.transitionSpeed == null ? 200 : options.transitionSpeed;
        this.notFoundAction = options.notFoundAction;
        this.forbiddenAction = options.forbiddenAction;
    }
}
