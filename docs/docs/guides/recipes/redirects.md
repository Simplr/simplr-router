# Recipes >> Redirects

Redirects can be done on any routes. Redirects can be to a path or a [named route](/guides/recipes/named-routes/).

```javascript
const routes = [
    { path: "", component: "minimal-setup" },
    { path: "example", component: "example-view", name: "Example" },
    {
        path: "/do-redirect", redirect: "/example"
    },
    {
        path: "/name-redirect", redirect: { name: "Example" }
    }
];
```
