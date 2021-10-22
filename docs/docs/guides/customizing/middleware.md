# Customizing >> Middleware

Simplr Router supports middleware to enhance the base functionality of the Router.

A middleware can be easily plugged into the router and used across the project.

A middleware instance can implement one or all of the middleware functions exposed by the router. The functions are as follows:

### Reactive events

These functions are used to react to events administrated by Simplr Router.

| Method                   | Type                                               | Description                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------ | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| routerNavigating         | Consumes: viewObject <br><br> Produces: viewObject | routerNavigating is called after the router has resolved the route it needs to navigate to. The viewObject will contain data about the route, if one was found. <br><br> This function can be used to apply additional checks to the routes, or for manipulating the route data before navigation actually happens. <br><br> Another use-case could be for example logging or analytics |
| routerNavigationComplete | Consumes: container <br><br> Produces: Nothing     | routerNavigationComplete is called after the navigation has finished. <br><br> This middleware hook could be used to apply additional effects to views after navigation has fully completed.                                                                                                                                                                                            |
| newViewAddedToDOM        | Consumes: container <br><br> Produces: Nothing     | newViewAddedToDOM is called as soon as the new view element has hit the DOM, and is accessible by javascript.<br><br> This middleware hook could be used to apply some additional effects as soon as possible, even before the whole transition animation has finished.                                                                                                                 |

### Overriding events

These functions are used to override the default behavior of Simplr Router

| Method                     | Type                                                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| addViewToContainerOverride | Consumes: container, viewObject <br><br> Produces: Nothing | addViewToContainerOverride overwrites the functionality Simplr Router has for appending a new View component into the Simplr Router Container. <br><br> If this function is defined in a middleware, it overrides the default functionality with the new one. <br><br> A use case for overriding the existing implementation could be for example support for a different javascript framework.<br><br> An example on this can be found from the official [React Middleware implementation](https://github.com/Simplr/simplr-router-react-middleware/blob/main/react-middleware.js#L5)                                                                                                                                                                                            |
| createComponentOverride    | Consumes: view <br><br>Produces: component                 | createComponentOverride overwrites the functionality Simplr Router has for creating the View Component before appending it into the Simplr Router Container. <br><br> Some frameworks might have a different way of creating a fresh component from the default implementation of Simplr Router. In these cases it's worth consideration to overwrite this function to impelment a custom builder for the view component. <br><br> The default functionality uses the document.createElement()-function to create the view, so if a different method is needed, this function can do that. <br><br>An example on this can be found from the official [React Middleware implementation](https://github.com/Simplr/simplr-router-react-middleware/blob/main/react-middleware.js#L9) |

## Using a middleware

Plugging in a middleware into Simplr Router can be done with the `use()`-function

```javascript
import SimplrRouter from "@simplr-wc/router";
import MyMiddleware from "./middleware.js";

const router = new SimplrRouter({ routes });
router.use(MyMiddleware);
router.init();
```

## Middleware template

A middleware that implements all of the functions would be as follows:

```javascript
export default class SimplrRouterMiddleware {
    routerNavigating(viewObject) {
        console.log("Navigating to view", viewObject);
        return viewObject;
    }

    routerNavigationComplete(container) {
        console.log("Navigation complete. New container around the new view is ", container);
    }

    newViewAddedToDOM(container) {
        console.log("Container containing the new view was added to the DOM", container);
    }

    addViewToContainerOverride(container, viewObject) {
        // This is actually the default configuration, but I'm overwriting it anyway
        container.appendChild(viewObject);
    }

    // This Overwrite example is from the React implementation
    createComponentOverride(view) {
        if (view.import) {
          await view.import();
        }
        return React.createElement(view.component, view.params, null);
    }
}
```
