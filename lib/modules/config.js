export default class Config {
    constructor(options) {
        this._parseOptions(options);
    }

    _parseOptions(options) {
        this.debugging = options.debugging;
        this.transitionSpeed = options.transitionSpeed || 200;
        this.notFoundAction = options.notFoundAction;
        this.forbiddenAction = options.forbiddenAction;
    }
}
