# Getting started >> Using a starter || 20

Simplr Router was built to work with Web Component environments and therefore the [Open-WC starter](https://open-wc.org/guides/developing-components/getting-started/)
is a perfect base for using this router.


## Initial setup

Start by initializing your project with the Open-WC starter

```bash
npm init @open-wc
```

This will prompt you to generate a starter application for your web component project. You should choose to create
an application, and add whatever optional tooling you need.

The setup we're using in this tutorial is as follows:

```
✔ What would you like to do today? › Scaffold a new project
✔ What would you like to scaffold? › Application
✔ What would you like to add? ›
✔ Would you like to use typescript? › No
✔ What is the tag name of your application/web component? … simplr-router-demo
```


## Installing the router

```bash
npm install @simplr-wc/router
```

This command will install the Simplr Router to your project and will be ready to use as soon as it's finished installing.

## Configuring History API fallback

To have client-side routing functioning correctly, we'll need to add a History API fallback.
Luckily the [Web Dev Server](https://modern-web.dev/docs/dev-server/overview/) allows us to do this easily.

Open up the `web-dev-server.config.mjs` -file, and add the following line to your config:

```properties
appIndex: 'index.html',
```

The file should now look something along the lines of

```javascript
// import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';

/** Use Hot Module replacement by adding --hmr to the start command */
const hmr = process.argv.includes('--hmr');

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open: '/',
  watch: !hmr,
  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },
  
  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  // esbuildTarget: 'auto'

  /** Set appIndex to enable SPA routing */
  appIndex: 'index.html',

  plugins: [
    /** Use Hot Module Replacement by uncommenting. Requires @open-wc/dev-server-hmr plugin */
    // hmr && hmrPlugin({ exclude: ['**/*/node_modules/**/*'], presets: [presets.litElement] }),
  ],

  // See documentation for all available options
});
```

Now even if we navigate outside of the index.html file's directory, we'll still load it every time, 
which is required by client side routing.

## Running the application

```bash
npm start
```

## Creating your initial routing

Let's start by removing the main web component from our `index.html` -file.

```html
<!-- index.html -->
<body>
  <script type="module" src="./src/simplr-router-demo.js"></script>
</body>
```

Then we'll move on to modifying the file loaded by our index.html. In this case that file is named `simplr-router-demo.js`

Let's first initialize the routing for our first view:

```javascript
const routes = [
    { path: "", component: "simplr-router-demo" }
];
```

Then let's create an instance of Simplr Router and pass it the routes as options:

```javascript
const router = new SimplrRouter({ routes });
```

And finally initialize the router (this will start the routing process).

```javascript
router.init();
```

The file should looks something along the lines of this by now:

```javascript
import { SimplrRouter } from "@simplr-wc/router";
import { SimplrRouterDemo } from "./SimplrRouterDemo.js";

customElements.define("simplr-router-demo", SimplrRouterDemo);

const routes = [
    { path: "", component: "simplr-router-demo" }
];

const router = new SimplrRouter({ routes });
router.init();
```

The starting view should now be visible on your browser.


## Adding views

Next we will want to do some actual routing. This requires a few steps:

1. Create a view to navigate to
2. Add it as a route
3. Create a link to navigate to the page

### Create a view to navigate to

Create a new view into our `src` folder as a new file called `ExampleView.js`.

```javascript
import { LitElement, html } from "lit";

export class ExampleView extends LitElement {
    render() {
        return html`
      <p>Hello from the example view!</p>
      <a href="/">Please take me back!</a>
    `;
    }
}

customElements.define("example-view", ExampleView);
```

### Add it as a route

Next you'll have to add this new view as a route. Navigate to the file with our routes, and add it there.

```javascript
import { SimplrRouter } from "@simplr-wc/router";
import { SimplrRouterDemo } from "./SimplrRouterDemo.js";
import "./ExampleView.js";

customElements.define("simplr-router-demo", SimplrRouterDemo);

const routes = [
    { path: "", component: "simplr-router-demo" },
    { path: "example", component: "example-view" }
];

const router = new SimplrRouter({ routes });
router.init();
```

**Notice that you'll need to import the view in this file statically or via [lazy loading](/guides/recipes/lazy-loading/)**

### Create a link to navigate to the page

Lastly you'll need a way to navigate to the page. This is where Simplr Router differs from some other
routing libraries: You'll do it the same way you'd do it with a Multi Page Application:

Add a anchor tag pointing to the new page into the starting view:

```javascript
// SimplrRouterDemo.js
// Some code omitted for clarity
render() {
    return html`
      <main>
        <div class="logo"><img alt="open-wc logo" src=${logo} /></div>
        <h1>${this.title}</h1>
        <a href="/example">Take me to the example page!</a>
      </main>
    `;
}
```

After doing this, you should be able to navigate between the pages seamlessly!

You can even use the browser's navigation buttons to navigate between these views.

## Next steps

You're now all set to start building your application on top of Simplr Router. For more configuration
options and recipes, check out the **recipes** section. For a thorough look into the actual API
behing Simplr Router, check out the **docs**.
