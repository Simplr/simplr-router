export default class Builder {
    async createComponentElement(view) {
        if (view.import) {
            await view.import();
        }
        const component = document.createElement(view.component);

        if (view.slots) {
            this._buildSlotElements(view, component);
        }

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

    _buildSlotElements(view, component) {
        const slotElementProperties = this._getSlotElementProperties();
        view.slots.forEach(async (slotProperties) => {
            if (slotProperties.import) {
                await slotProperties.import();
            }
            // The only non-predefined key should be the name of the slot
            // e.g. { "top-bar": "my-top-bar", import: () => import("./my-top-bar.js") }
            const slotName = Object.keys(slotProperties)
                .filter((key) => !slotElementProperties.includes(key))
                .pop();

            if (!slotName) {
                return;
            }

            const slotComponent = document.createElement(slotProperties[slotName]);

            slotComponent.slot = slotName;
            component.appendChild(slotComponent);
        });
    }

    _getSlotElementProperties() {
        return ['import'];
    }

    _determineMovementDirection(transitionBackwards, movingIn) {
        if (transitionBackwards) {
            return movingIn ? 'leaving-view' : 'entering-view';
            //return movingIn ? 'from-left' : 'to-right';
        }
        return movingIn ? 'entering-view' : 'leaving-view';
        //return movingIn ? 'from-right' : 'to-left';
    }
}
