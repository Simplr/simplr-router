# Customizing >> Changing routing root

When hosting your SPA in a service, a situation might come where the URL path of your applications
includes something more than the routes of your application.

An example of this would be hosting on github pages, where your URL would look something like this:
`https://simplr.github.io/simplr-router/guides`.

In these cases you might not want to write the `simplr-router` part of the URL into every route manually.

This can be resolved by using a root path, to determine from what part of the URL the router starts parsing.

```javascript
const routerOptions = {
    routes: [
        {
            name: "Home",
            path: "",
            component: "router-demo",
        },
        {
            name: "Example",
            path: "example",
            component: "router-example",
            import: () => import("./router-example.js")
        }
    ],
    rootPath: "/my-app"
}

const router = new SimplrRouter(routerOptions);
router.init();
```

Now navigating to `/my-app/example` will provide the example route successfully.

