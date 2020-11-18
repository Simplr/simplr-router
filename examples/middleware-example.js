export default class SimplrRouterMiddleware {
    routerNavigating(viewObject) {
        return viewObject;
    }

    routerNavigationComplete() {}

    newViewAddedToDOM() {}

    /*
     *  Original implementation:
     *
     *  container.appendChild(viewComponent);
     *
     * */
    addViewToContainerOverride(container, viewObject) {}

    /**
     *  Original implementation:
     *
     *  Builder.createComponentElement(view);
     * */
    createComponentOverride(view) {}
}
