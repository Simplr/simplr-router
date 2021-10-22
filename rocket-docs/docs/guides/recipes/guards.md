# Recipes >> Guards

Route guards can be used to prevent access to certain pages from users.

Guards are a programmatic interface that allows you to create custom guard functions to check if the current user is authorized to
view a route.

If a guarding function returns true, access to the page is granted.

On an unauthorized access attempt, the forbiddenAction is launched or the forbidden -view is displayed.

```javascript
const routes = [
    { path: "", component: "minimal-setup" },
    { path: "example", component: "example-view", name: "Example" },
    {
        path: "/guarded",
        component: "example-view",
        guard: () => {
            // A 50/50 chance to get on page
            return Math.random() >= 0.5
        }
    }
];

new SimplrRouter({ routes }).init();
```
