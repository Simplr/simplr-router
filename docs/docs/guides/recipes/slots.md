# Recipes >> Slots

Simplr Router allows you to define slots to be appended to the view while the view is loaded to DOM.

This allows creating views with dynamic slotted elements depending on the route the user accessed the view from.


```javascript
const routerOptions = {
    routes: [
        {
            name: "Home",
            path: "",
            component: "router-demo",
            slots: [
                {
                    'top-bar': 'regular-top-bar',
                },
            ],
        },
        {
            path: 'special-home',
            component: 'router-demo',
            slots: [
                {
                    'top-bar': 'special-top-bar',
                },
            ],
        },
    ],
}
```

The following code will append a component named `regular-top-bar` or `special-top-bar` into the named slot `top-bar` of the view `router-demo`.
