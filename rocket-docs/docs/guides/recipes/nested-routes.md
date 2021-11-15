# Recipes >> Nested routes

In some situations, just a top level navigation might not be enough, you might need to
have a dynamic sub-view on your page that is updated on navigation to another view.

For these situations you can use nested views. In nested views, only the inner part of your view changed
when navigating between nested views.

**The content will be rendered inside the parent view, so if you're using web components, you will need
to have a slot to display the nested view**

```javascript
const routes = [
    { path: "", component: "simplr-router-demo" },
    {
        path: "users",
        component: "users-view",
        children: [
            {
                path: "",
                component: "users-list-view",
            },
            {
                path: ":userId",
                component: "user-profile-view",
                pattern: { userId: "\\d+" }
            },
            {
                path: "new",
                component: "user-add-view",
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
/users
/users/{id}
/users/new
```

When navigating to the view `/users` the page view `users-view` will be rendered, and inside it, as it's
Light DOM child, will be rendered the component `users-list-view`. This is because `users-list-view`'s path 
is blank. This marks it as the "base" nested view for this view.

When the user navigates from `/users` to `/users/new`, only the nested view will be changed, not the whole view.

```

  /users                                         /users/new
┌────────────────────────────────┐            ┌──────────────────────────────────┐
│                                │            │                                  │
│    users-view                  │            │    users-view                    │
│                                │ ───────►   │                                  │
│          ┌─────────┐           │            │           ┌──────────┐           │
│          │ users-  │           │            │           │ user-    │           │
│          │ list-   │           │            │           │ add-     │           │
│          │ view    │           │ ───────►   │           │ view     │           │
└──────────┴─────────┴───────────┘            └───────────┴──────────┴───────────┘

```

The DOM nodes of this view will be as follows:

```html
<simplr-router-container>
    <users-view>
        <user-add-view></user-add-view>
    </users-view>
</simplr-router-container>
```
