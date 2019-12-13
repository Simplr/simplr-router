# Simplr-Router

Simplr Router is a easy to use and easy to set up router for Web Components.

Simplr Router supports SPA-like asynchronous page loading for mobile-like experiences and UI:s.

Simplr Router is a minimal set up, which doesn't change your projects' css rules, 
so you might need to adjust your css (Especially overflows) to accompany the routers' 
actions.

You can find the project at github: https://github.com/Matsuuu/simplr-router

Installation
-------------------

`npm install simplr-router --save`

Testing
-------------------

Tests have been written, and can be run with Jest

Requirements
-------------------

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

Setting up
-----------------

### Setting up the Router

After initializing the root of you project, add the following code snippet into your javascript:

*Note that:* all of the properties passed to the constructor are not required, and can be left out, in which case
they will be initialized with the default values. 

```javascript
import SimplrRouter from "simplr-router";
import routes from "../simplr-routes.js";

let router = new SimplrRouter({
    activeView: this,
    routes: routes,
    notFoundAction: () => {
        alert('Page not found');
    },
    forbiddenAction: () => {
        alert('Forbidden');
    },
    transitionSpeed: TransitionSpeed.FAST,
    transitionDirection: TransitionDirection.RIGHT,
    debugging: true,
    waitForLoad: true,
    stackedViews: true,
});

router.init();
```

When using lit elements, you can just pass `this` as the first parameter.

The first parameter initializes the index of the web project.

Parameters that can be passed to the initializer are:
---

| Param name | Param purpose | Type | Required | Default to |
|------------|----------------|------|----------|-----------|
| debugging  | Enable debugging? | Boolean | No | false |
| activeView | The active view the router is initialized from. Usually set to the root layer of application | Object | Yes | - |
| routes | Routes JSON array from the simplr-routes file | JSON Array | Yes | - |
| transitionSpeed | Transition speed of the router | TransitionSpeed object or float | No | TransitionSpeed.FAST |
| transitionDirection | Direction the new view arrives from | TransitionDirection object | No | TransitionDirection.RIGHT |
| useStyles | Should Router use the default transitions built into the library? (Recommended) | Boolean | No | true
| waitForLoad | Should Router wait for the view to load before transitioning? | Boolean | No | false |
| stackedViews | Should Router stack the loaded views on top of each other or just remove the last view from DOM? | Boolean | No | false |
---

### Stacked views

Simplr Router supports two types of layouts/transitions.

The first type is non-stacking views. When using non-stacking views, 
the loaded view will be added to the view, and after the transition finishes, the previous view 
will be removed from DOM.

The second type is stacking views, which is more familiar from mobile UI's. In stacking views -mode
the views are simply stacked on top of each other in the DOM, and the previous views will keep running in the background.

##### Pro's and cons of both types:

With non-stacking views, the DOM tree will stay cleaner, since the previous views are removed. This is especially good, if your have 
a lot of sites with a lot of heavy components. 

The downside in non-stacking views is, that if you move backwards in the sites, all of the actions that are executed when creating the view
will be executed again, since the view is freshly added to the DOM again.

With stacking views, the DOM tree will be a bit more crowded, since all of the views will be held in the DOM until the user 
moves away from that layer of the application.

The plus side here is that since the view is never removed from the DOM, none of the progress is lost on the previous layer,
 nor will the site have to fetch the information needed for that view again on a backwards browser action. (like pressing the previous page -button)

Stacking views are designed to create a more mobile-like experience, where as non-stacking views are for more of a desktop experience.

### Setting up Routes
Set up the routes for your application by creating a routes-file somewhere in your project.

**Example routes file**
```javascript
import "views/simplr-foo";
import "views/simplr-frontpage";
import "views/simplr-foo-with-id";
import "views/simplr-foo-with-id-info";
import "views/simplr-foo-bar-with-id";
import AuthGuard from "./src/guards/AuthGuard";


const routes = [
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
        "view": "simplr-foo-bar-with-id",
        "guard": AuthGuard.isAuthenticated
    }
];
export default routes;
```

When working with a framework like Lit Html, 
you need to import the view files into the router,
 or declare the custom elements in some other way.
 
##### Url parameters
 
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
 
##### Guards

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

### Waiting for load

When waitForLoad is set to true, the Simplr Router will wait for the loaded page to load, and after it's loaded, transition it into the view.

Simplr Router will check the property "isLoading" of the loaded view until it returns falsey, and then execute the transition.

This can be achieved by adding a "isLoading" -attribute to the object, or adding a "isLoading" property to the object's dataset.

Example implementations:

```javascript
// With attributes
connectedCallback() {
    console.log('I have connected');
    this.setAttribute('isLoading', 'true');
    this.doVeryLongTask();
}

doVeryLongTask() {
    // Longs task
    this.removeAttribute("isLoading");
}
```

```javascript
// With properties
connectedCallback() {
    console.log('I have connected');
    this.isLoading = true;
    this.doVeryLongTask();
}

doVeryLongTask() {
    // Longs task
    this.isLoading = false;
}
```



### Setting up links

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



### Customizing Simplr Router
You can customize the preset animations of the Simplr Router 
by modifying the following properties.

##### Transition Speed

Transition speed between views can be changed to a preset speed
or a custom speed set by the programmer.
```javascript
// TransitionSpeed.FAST is set by default

// Preset speeds can be found in 'simplr-router-transition-speed.js'
SimplrRouter.setTransitionSpeed(TransitionSpeed.VERYFAST); 
// You can also set a numeric value for the transition speed property
SimplrRouter.setTransitionSpeed(0.2);
```


##### Transition direction

Transition direction declares from which direction the new view 
will be slid from.

```javascript
// TransitionDirection.RIGHT is set by default.

SimplrRouter.setTransitionDirection(TransitionDirection.BOTTOM);
SimplrRouter.setTransitionDirection(TransitionDirection.TOP);
SimplrRouter.setTransitionDirection(TransitionDirection.RIGHT);
SimplrRouter.setTransitionDirection(TransitionDirection.LEFT);
```

##### Custom 404 action

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


##### Custom 401 action

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