export default class Dispatcher {
    static sendTransitionStartEvent(view) {
        Dispatcher._sendEvent(new CustomEvent({ message: 'simplr-router-transition-start', view }));
    }

    static sendTransitionFinishEvent() {
        Dispatcher._sendEvent(new CustomEvent({ message: 'simplr-router-transition-end' }));
    }

    static sendRouterInitializedEvent(routes) {
        Dispatcher._sendEvent(new CustomEvent({ message: 'simplr-router-initialized', routes }));
    }

    static _sendEvent(event) {
        window.dispatchEvent(event);
    }
}
