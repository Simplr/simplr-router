export default class Builder {
    async createComponentElement(view) {
        if (view.import) {
            await view.import();
        }
        const component = document.createElement(view.component);
        if (view.params) {
            Object.keys(view.params).forEach((key) => {
                component[key] = view.params[key];
            });
        }
        return component;
    }

    createViewContainer(viewObject, movingIn) {
        const container = document.createElement('simplr-router-container');
        if (!viewObject.initialView) {
            container.setAttribute(this._determineMovementDirection(viewObject.backwards, movingIn), '');
        }

        return container;
    }

    _determineMovementDirection(transitionBackwards, movingIn) {
        if (transitionBackwards) {
            return movingIn ? 'from-left' : 'to-right';
        }
        return movingIn ? 'from-right' : 'to-left';
    }
}
