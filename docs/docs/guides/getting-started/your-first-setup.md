# Getting started >> Your first setup || 10

Simplr Router works by matching url pathing with Custom Element views.

Simplr Router aims to provide developers a quick-to-setup but configurable routing setup for projects of all size.

```javascript
import { SimplrRouter } from "@simplr-wc/router";
import "./minimal-setup.js";
import "./example-view.js";
import "./dynamic-view.js";

const routes = [
  { path: "", component: "minimal-setup" },
  { path: "example", component: "example-view" },
  { path: "dynamic/:id", component: "dynamic-view" },
];

new SimplrRouter({ routes }).init();
```

The Router sets itself up as you call `init()` on the router instance. While setting up,
the router starts listening for navigation events on the page and navigates with it's routing where possible.

You don't need to create custom navigation methods. Simplr Router overrides the default action of anchor tags when
the navigation target is listed as a route.


<iframe src="https://codesandbox.io/embed/simplr-router-demo-c0xno?autoresize=1&fontsize=12&theme=light&module=%2Fsrc%2Frouting.js&editorsize=60"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Simplr Router Demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
