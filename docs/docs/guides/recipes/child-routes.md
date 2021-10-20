# Recipes >> Child routes

In many cases we want to create paths that inherit from the paths leading into them.
In these cases we can add them as the child routes of a created route, saving us from having to write
the whole route, and creating a cleaner routing table.

```javascript
const routes = [
    { path: "", component: "simplr-router-demo" },
    {
        path: "user",
        component: "user-view",
        routes: [
            {
                path: ":id",
                component: "user-profile-view"
            },
            {
                path: "add",
                component: "user-add-view"
            },
            {
                path: "edit",
                component: "user-edit-view"
            }
        ]
    },
];

const router = new SimplrRouter({ routes });
router.init();
```

The mapping above will create the following routes:

```
/
/user
/user/{id}
/user/add
/user/edit
```

Static routes will always take priority over dynamic routes, so `/user/add` will always match the static route
and not the `/user/:id` -route
