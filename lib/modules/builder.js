import { SimplrRouterContainer } from './simplr-router-container';

export class Builder {
    /**
     * @param {SimplrRouterNavigationData} view
     *
     * @returns {Promise<HTMLElement>}
     */
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

    /**
     * @param {SimplrRouterNavigationData} viewObject
     * @param {boolean} movingIn
     * @param {number} transitionSpeed
     */
    createViewContainer(viewObject, movingIn, transitionSpeed) {
        const container = /** @type SimplrRouterContainer */ (document.createElement('simplr-router-container'));
        container.transitionSpeed = transitionSpeed ?? 0;
        if (!viewObject.initialView) {
            container.setAttribute(this._determineMovementDirection(viewObject.backwards, movingIn), '');
        }

        return container;
    }

    /**
     * @param {SimplrRouterNavigationData} view
     * @param {HTMLElement} component
     */
    _buildSlotElements(view, component) {
        const slotElementProperties = this._getSlotElementProperties();
        view.slots.forEach(async (slotProperties) => {
            if (slotProperties.import && typeof slotProperties.import === 'function') {
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

            const slotComponentName = slotProperties[slotName];
            if (typeof slotComponentName === 'string') {
                const slotComponent = document.createElement(slotComponentName);
                slotComponent.slot = slotName;
                component.appendChild(slotComponent);
            }
        });
    }

    _getSlotElementProperties() {
        return ['import'];
    }

    /**
     * @param {boolean} transitionBackwards
     * @param {boolean} movingIn
     */
    _determineMovementDirection(transitionBackwards, movingIn) {
        if (transitionBackwards) {
            return movingIn ? 'leaving-view' : 'entering-view';
        }
        return movingIn ? 'entering-view' : 'leaving-view';
    }
}
