export default class Dispatcher {
    static sendTransitionStartEvent(view) {
        Dispatcher._sendEvent(new CustomEvent({ message: 'Transition to view started', view }));
    }

    static sendTransitionFinishEvent() {
        Dispatcher._sendEvent(new CustomEvent({ message: 'Transition to view finished' }));
    }

    static sendRouterInitializedEvent(routes) {
        Dispatcher._sendEvent(new CustomEvent({ message: 'Router finished initializing', routes }));
    }

    static _sendEvent(event) {
        window.dispatchEvent(event);
    }
}
