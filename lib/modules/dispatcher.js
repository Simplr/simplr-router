export function sendTransitionStartEvent(view) {
    sendEvent(new CustomEvent('simplr-router-transition-start', { detail: { view } }));
}

export function sendTransitionFinishEvent() {
    sendEvent(new CustomEvent('simplr-router-transition-end'));
}

export function sendRouterInitializedEvent(routes) {
    sendEvent(new CustomEvent('simplr-router-initialized', { detail: { routes } }));
}

export function sendNavigatedEvent(view, historyPath) {
    sendEvent(new CustomEvent('simplr-router-navigated', { detail: { view, historyPath } }));
}

function sendEvent(event) {
    window.dispatchEvent(event);
}
