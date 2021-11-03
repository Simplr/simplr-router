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

## Binding values from guard functions

Sometimes in guard functions, you might access data from an external source, like an API. In these
situations you might want to carry this data onwards into the view. 

The Guard API passes the view params object to the guard function as it's first parameter, and allows
you to bind values to it, binding them into the view as it's created.

```javascript
const routes = [
    { path: "", component: "minimal-setup" },
    { path: "example", component: "example-view", name: "Example" },
    {
        path: "/guarded",
        component: "example-view",
        guard: (viewParams) => {
            // A 50/50 chance to get on page
            const roll = Math.random();
            viewParams.roll = roll;
            return roll >= 0.5;
        }
    }
];

new SimplrRouter({ routes }).init();
```

## Observing view parameters in guard functions

Similiarly to the binding of values, you can also access the view parameters of dynamic routes in your guard functions.

```javascript
const routes = [
    { path: "", component: "minimal-setup" },
    { path: "example", component: "example-view", name: "Example" },
    {
        path: "/guarded/:id",
        component: "example-view",
        guard: (viewParams) => {
            console.log(viewParams);
            return viewParams.id > 0;
        }
    }
];
```
