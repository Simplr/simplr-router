# Recipes >> Lazy loading

Lazy loading is a technique in which the content of the web page is split between multiple files,
allowing for on-demand loading of content as it's needed, reducing initial load on your app.

Simplr Router supports lazy loading for it's view routes. This has the potential of saving a lot
of time in your page's initial load times.

In a regular routing situation, your routing file might look something like this:

```javascript
import { SimplrRouter } from "@simplr-wc/router";
import "./ExampleView.js";

const routes = [
    { path: "", component: "simplr-router-demo" },
    { path: "example", component: "example-view" }
];

const router = new SimplrRouter({ routes });
router.init();
```

To enable lazy loading, remove the import statements of the views you want to load lazily from the
top of the file, and add them as properties to your routes:

```javascript
import { SimplrRouter } from "@simplr-wc/router";

const routes = [
    { path: "", component: "simplr-router-demo" },
    { path: "example", component: "example-view", import: () => import("./ExampleView.js") }
];

const router = new SimplrRouter({ routes });
router.init();
```

Now the view is only imported as the page is loaded, reducing initial load on your web app. 
It goes without saying that this might have magnitudes of effect on web applications where you have a large
collections of views.

### Bundlers

Due to the nature of the import being in code, most bundlers should be able to grasp onto the import statement
and bundle it correctly, even if the file gets renamed.
