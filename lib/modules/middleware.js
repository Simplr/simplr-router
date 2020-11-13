export default class SimplrRouterMiddleware {
    routerNavigating(viewObject) {
        return viewObject;
    }

    routerNavigationComplete() {}

    newViewAddedToDOM() {}

    addViewToContainerOverride(container, viewObject) {}
}
