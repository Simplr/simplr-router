# Recipes >> Named routes

Sometimes refering to the routes by the full path might be cumbersome, and you would father navigate using the 
name of the path. This can be done by naming the paths with a unique name and programmatically navigating to them.

```javascript
const routes = [
    { path: "", component: "minimal-setup" },
    { path: "example", component: "example-view", name: "Example" }
];

// Navigate to the named route
changeView({ name: "Example" })
```
