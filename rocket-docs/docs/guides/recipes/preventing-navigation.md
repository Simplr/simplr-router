# Recipes >> Preventing navigation

In some cases you might want to prevent leaving a page of your application. The normal case of preventing this
would be done using the [onbeforeunload](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload)
listener. This however doesn't work out of the box with SPA routers.

If you want to prevent navigation to another page on your SPA application, you can add a `preventUnload` property
to the route you want to prevent unloads from.

```javascript
const routes = [
    { path: "", component: "minimal-setup" },
    { path: "example", component: "example-view", name: "Example" }
    {
        path: "prevent",
        component: "prevent-example",
        preventUnload: true,
    },
];
```

Doing this will ask the user for confirmation, as they are about to navigate to another page of your application
from your `prevent` view.

Note that if you want to implement preventing navigation to another domain / site, you should do it yourself 
using the [onbeforeunload](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload)
API.
