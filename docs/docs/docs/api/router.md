# API >> Router

Type name: SimplrRouter

| Name                 | Type                                   | Description                                    |
| -------------------- | -------------------------------------- | ---------------------------------------------- |
| init()               | Function()                             | Initialize Simplr Router and start navigating. |
| changeView()         | Function(ChangeViewObject)             | Change view to given path or named route.      |
| use(middlewareClass) | Function(any)                          | Add middleware to Simplr Router.               |
| getBreadcrumbs()     | Function(): SimplrRouterBreadcrumb[]   | Returns the breadcrumbs for the current route. |
| getCurrentView()     | Function(): SimplrRouterNavigationData | Returns the current view.                      |
