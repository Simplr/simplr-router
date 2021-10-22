# Recipes >> Error pages

Simplr router supports 2 kinds of error pages by default:

- Not found -page
- Forbidden/Unauthorized -page

These have special routings set up for them inside the router, and are programmed into the router.

In action this means that if a not found -page is set in the routes, it will be displayed by the router in a case
where the route provided by the user is not found on the application.

In the same manner, if a guard returns a falsey value, a forbidden view will be loaded.

```javascript
const routerOptions = {
    routes: [
        {
            name: "Home",
            path: "",
            component: "router-demo"
        },
        {
            name: "Example",
            path: "example",
            component: "router-example",
        },
        {
            name: "Guarded",
            path: "guarded",
            component: "router-example",
            guard: () => {
                return Math.random() >= 0.5;
            }
        },
        {
            path: "not-found",
            component: "not-found-view"
        },
        {
            path: "forbidden",
            component: "forbidden-view"
        }
    ],
}

const router = new SimplrRouter(routerOptions);
router.init();
```

