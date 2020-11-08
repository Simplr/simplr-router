export default class Logger {
    constructor(options) {
        this.debugging = options.debugging;
    }

    info(message) {
        if (this.debugging) {
            console.log(message);
        }
    }
}
