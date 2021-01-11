export function sendTransitionStartEvent(view) {
    sendEvent(new CustomEvent({ message: 'simplr-router-transition-start', view }));
}

export function sendTransitionFinishEvent() {
    sendEvent(new CustomEvent({ message: 'simplr-router-transition-end' }));
}

export function sendRouterInitializedEvent(routes) {
    sendEvent(new CustomEvent({ message: 'simplr-router-initialized', routes }));
}

function sendEvent(event) {
    window.dispatchEvent(event);
}
