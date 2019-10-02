# Simplr-Router

Simplr Router is a easy to use and easy to set up router for Web Components.

Simplr Router supports SPA-like asynchronous page loading for mobile-like experiences and UI:s.

Simplr Router is a minimal set up, which doesn't change your projects' css rules, 
so you might need to adjust your css (Especially overflows) to accompany the routers' 
actions.

Installation
-------------------

`npm install simplr-router --save`

Usage
-------------------

#### Set Up

Simplr Router requires a history fallback to work as wanted. 

This will ensure that the browser always loads the index file, no matter the route.

A minimal setup for this can be done for example with node:

```javascript
const express = require("express");

const app = express();
app.use(express.static(`${__dirname}/dist/`));
app.use((req, res) => res.sendFile(`${__dirname}/dist/index.html`));
app.listen(3000);

```

If you're using webpack-dev-server while developing, you can active 
the historyApiFallback with the following config:
```javascript
devServer: {
    historyApiFallback: true
}
```

On ES Dev server, you can set the app-index -property to your index file, 
and it should provide the same functionality.

#### Setting up Routes
Set up the routes for your application by creating a routes-file in the root of your project.

**The Routes file needs to be named 'simplr-routes.js''**

##### Example routes file
```javascript
import "views/simplr-foo";
import "views/simplr-frontpage";
import "views/simplr-foo-with-id";
import "views/simplr-foo-with-id-info";
import "views/simplr-foo-bar-with-id";


export const routes = [
    {
        "path": "",
        "view": "simplr-frontpage"
    },
    {
        "path": "foo",
        "view": "simplr-foo"
    },
    {
        "path": "foo/:fooId",
        "view": "simplr-foo-with-id"
    },
    {
        "path": "foo/:fooId/info",
        "view": "simplr-foo-with-id-info"
    },
    {
        "path": "foo/:fooId/bar",
        "view": "simplr-foo-with-id"
    },
    {
        "path": "foo/:fooId/bar/:barId",
        "view": "simplr-foo-bar-with-id"
    }
]
```

When working with a framework like Lit Html, 
you need to import the view files into the router,
 or declare the custom elements in some other way.
 
 **Url parameters**
 
 Simplr Router provides routes with dynamic properties.
 
 To create such a route, use the ":"-prefix, and follow it up with the property name 
 wanted for the property when it's imported into the loaded view.
 
 ```javascript
{
    "path": "foo/:fooId",
    "view": "simplr-foo-with-id"
}
```

When navigated to the path above with a route like `localhost/foo/12`, the 
route will provide a web component with the property appended with the name provided.

```html
<simplr-foo-with-id fooId="12"></simplr-foo-with-id>
``` 
 
**Guards**

You can set guards for routes, where you want to check for example for user privileges.
To set a guard, import the class with the guards to the routes file, and add a "guard"-property 
to the chosen route.

```javascript
import AuthGuard from "./src/guards/AuthGuard";

// ...

{
    "path": "foo/:fooId",
    "view": "simplr-foo-with-id",
    "guard": AuthGuard.isAuthenticated
}
```
 
 A guard should always return a truthy or a falsy response, and in the case of a falsy 
 response, the router will handle the 401 action set.
 
##### Setting up the Router

After initializing the root of you project, add the following code snippet into your javascript:
```javascript
import SimplrRouter from "simplr-router";
import routes from "../simplr-routes";

SimplrRouter.init(this, routes);
```

When using lit elements, you can just pass `this` as the first parameter.

The first parameter initializes the index of the web project.


Simplr Router can also be initialized with a boolean flag `useStyles`, 
which is to true by default. If you want to create your own style/logic 
for the Router view transition, you can easily turn off the preset styles 
by initializing the Router with
```javascript
SimplrRouter.init(this, false);
```

##### Creating Simplr Router links
Simplr Router will link to all of the anchor elements on the page, 
which have the property `data-simplr-route`. All other anchor tags will 
be ignored by the Router
```html
<a href="foo" data-simplr-route>Links to Foo</a>
<a href="foo/12" data-simplr-route>Links to Foo 12</a>
<a href="foo/12/info" data-simplr-route>Links to Foo 12 info</a>
<a href="baz" data-simplr-route>Links to Baz</a>
<a href="https://www.google.com">Links to external page</a>
```


#### Customizing Simplr Router
You can customize the preset animations of the Simplr Router 
by modifying the following properties.

**Transition Speed**

Transition speed between views can be changed to a preset speed
or a custom speed set by the programmer.
```javascript
// TransitionSpeed.FAST is set by default

// Preset speeds can be found in 'simplr-router-transition-speed.js'
SimplrRouter.setTransitionSpeed(TransitionSpeed.VERYFAST); 
// You can also set a numeric value for the transition speed property
SimplrRouter.setTransitionSpeed(0.2);
```

**Transition direction**

Transition direction declares from which direction the new view 
will be slid from.

```javascript
// TransitionDirection.RIGHT is set by default.

SimplrRouter.setTransitionDirection(TransitionDirection.BOTTOM);
SimplrRouter.setTransitionDirection(TransitionDirection.TOP);
SimplrRouter.setTransitionDirection(TransitionDirection.RIGHT);
SimplrRouter.setTransitionDirection(TransitionDirection.LEFT);
```

**Custom 404 action**

When a page is not found from the route file, there are multiple scenarios you might 
want to execute.

Simplr Router allows you to set a 404 view in the routes-file

```javascript
// /simplr-routes.js
{
    "path": "not-found",
    "view": "simplr-page-not-found"
}
```

If no 404 route is set, a console error message is displayed.


A custom method can also be set or a 404 situtation
```javascript
SimplrRouter.setNotFoundAction(() => console.log("Not found"));
```


**Custom 401 action**

When a guard return a falsy value, a 401 page is displayed, if one is set in the 
routes file.

```javascript
// /simplr-routes.js
{
    "path": "forbidden",
    "view": "simplr-page-forbidden"
}
```


A custom method can also be set for a 401 situation
```javascript
SimplrRouter.setForbiddenAction(() => console.log("Forbidden"));
```