# Recipes >> Dynamic routes

When creating frontend routing, often you might want to map a route by a given pattern. To achieve this,
dynamic routing is needed.

Example of a case where dynamic routing could be used is when creating a user view with a dynamic ID to differentiate between multiple users.

```javascript
const routes = [
    { path: "", component: "front-page" },
    { path: "user", component: "user-list" },
    { path: "user/:id", component: "user-profile" },
];
```

When navigating to `/user/123`, the `id` property of the view will be provided the paramter from the URL, in this case `123`.

### Dynamic route keys

Dynamic routes can provide any key they want as the dynamic part, and it will be matched by that key.

```javascript
// In route
{ path: "user/:id", component: "user-profile" },
// In the view component when navigating to /user/123
console.log(this.id)
>>> 123

// In route
{ path: "table/:tableType", component: "table-view" },
// In the view component when navigating to /table/closed
console.log(this.tableType)
>>> "closed"
```

