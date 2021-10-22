# API >> Helper function

Helper functions are callable functions that plug into the currently active Simplr Router instance
without the developer having to hold onto a reference of the router.

Helper functions are exported from the same package as the router itself.

```javascript
import { getBreadcrumbs } from "@simplr-wc/router";
```

| Name             | Type                                   | Description                                    |
| ---------------- | -------------------------------------- | ---------------------------------------------- |
| getBreadcrumbs() | Function(): SimplrRouterBreadcrumb[]   | Returns the breadcrumbs for the current route. |
| getCurrentView() | Function(): SimplrRouterNavigationData | Returns the current view.                      |
