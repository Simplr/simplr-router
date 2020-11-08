![Title Image](simplr-router-title-image.png)

# Simplr-Router

[![npm version](https://badgen.net/npm/v/@simplr-wc/router)](https://www.npmjs.com/package/@simplr-wc/router)
[![size](https://badgen.net/bundlephobia/minzip/@simplr-wc/router)](https://bundlephobia.com/result?p=@simplr-wc/router)
[![dependency count](https://badgen.net/bundlephobia/dependency-count/@simplr-wc/router)](https://bundlephobia.com/result?p=@simplr-wc/router)

## Features

------

**Simplr Router is a framework agnostic router which is:**

👍 Easy to use

🏗️ Easy to setup

🦆 Lightweight

🚚 Easy to transition into

🚢 And ships with zero dependencies


---


You can check out a quick demo in the [CodeSandBox](https://codesandbox.io/s/quirky-hill-330x0?fontsize=14&hidenavigation=1&theme=dark)

--------

## Usage

Simplr Router creates seamless transitions between views and provides smooth user experiences.

Simplr Router ships with 0 dependencies, and weighs in at just around [3kb](https://bundlephobia.com/result?p=@simplr-wc/router)

For a full review of the library, go visit [the docs](https://router.matsu.fi/)

------

## Getting started

To immediately get started using SimplrRouter, you can follow the Quick Start guide in the [docs](https://router.matsu.fi/quick-start)


------

## Examples

---------

### Minimal

A minimal setup of Simplr Router would look something along the lines of:

```javascript
import SimplrRouter from "@simplr-wc/router";
import "./views/hello-view.js";
import "./views/root-view.js";

const routes = [
  {
    path: "/",
    component: "root-view",
  },
  {
    path: "/hello",
    component: "hello-view",
  },
];

const routerOptions = {
  routes,
};

const router = new SimplrRouter(routerOptions);
router.init();
```

----------

### Dynamic Imports / Code Splitting

Dynamic imports are supported by Simplr Router out of the box, and can be enabled quickly by just adding a `import`-property to each of the routes you want to dynamically import:

```javascript
import SimplrRouter from "@simplr-wc/router";

    const routes = [
        {
            path: '',
            component: 'router-docs-root',
            import: () => import('./views/root-view.js'),
        },
        {
            path: 'getting-started',
            component: 'router-docs-getting-started',
            import: () => import('./views/getting-started.js'),
        },
        {
            path: 'api-description',
            component: 'router-docs-api-description',
            import: () => import('./views/api-description.js'),
        }
    ];
    const routerOptions = {
      routes,
    };

    const router = new SimplrRouter(routerOptions);
    router.init();
```

---------

### Subroutes

Subroutes are also easily added to the routing ecosystem by providing a route with a `routes`-property.

```javascript
  import SimplrRouter from '@simplr-wc/router';
  import './views/main-page.js';
  import './views/user-profile.js';
  import './views/user-root.js';
  import './views/user-profile-edit.js';

  const routes = [
  {
      path: '/',
      component: 'main-page',
  },
  {
      path: '/user',
      component: 'user-root',
      routes: [
          {
              path: ':userId',
              component: 'user-profile',
              routes: [
                  {
                      path: 'edit',
                      component: 'user-profile-edit',
                  },
              ],
          },
      ],
  },
  ];

  const router = new SimplrRouter({ routes });
  router.init();
```

------------

### Dynamic routes

You can parametrize your routes easily by using the `:`-prefix in your route parameters. Route parameters will be passed on to the view as properties for easy use.

```javascript
  import SimplrRouter from '@simplr-wc/router';
  import './views/main-page.js';
  import './views/user-profile.js';
  import './views/user-root.js';
  import './views/user-profile-edit.js';

  const routes = [
  {
      path: '/',
      component: 'main-page',
  },
  {
      path: '/user',
      component: 'user-root',
      routes: [
          {
              path: ':userId',
              component: 'user-profile'
          },
      ],
  },
  ];

  const router = new SimplrRouter({ routes });
  router.init();
```


--------

### Guards

You can set up guard functionality for routes for cases where you want to validate access to a route before displaying the view.

In a case where access is denied, a "Forbidden"-page is shown, if one is set. If no forbidden-page is set, a forbidden-action is launched. Read more about these in [the docs](https://router.matsu.fi/recipes/error-pages).

```javascript
    import SimplrRouter from '@simplr-wc/router';
    import './views/main-page.js';
    import './views/user-profile.js';
    import './views/user-root.js';
    import './views/user-profile-edit.js';
    import './views/forbidden-page.js';

    const checkUserId = () => {
        // Do actual checking, for example with an API
        return false;
    };

    const routes = [
        {
            path: '/',
            component: 'main-page',
        },
        {
            path: 'user',
            component: 'user-root',
            routes: [
                {
                    path: ':userId',
                    component: 'user-profile',
                    routes: [
                        {
                            path: 'edit',
                            component: 'user-profile-edit',
                            guard: checkUserId,
                        },
                    ],
                },
            ],
        },
        {
            path: 'forbidden',
            component: 'forbidden-page',
        },
    ];

    const router = new SimplrRouter({ routes, debugging: true });
    router.init();
```

----------

### Slotted elements

Simplr Router allows for elements to be appended into slots of view components.

This allows creating views with dynamic slotted elements depending on the route the user accessed the view from.

To add a slot to the view, you just add an array of Slot Elements to the wanted route object:

```javascript

  const routes = [
      {
          path: '',
          component: 'router-docs-root',
          import: () => import('./views/root-view.js'),
      },
      {
          path: 'user-page',
          component: 'user-page',
          import: () => import('./views/user-page.js'),
          slots: [
              {
                  'top-bar': 'default-topbar',
                  import: () => import('./partials/top-bar.js'),
              },
          ],
      },
      {
          path: 'admin-user-page',
          component: 'user-page',
          import: () => import('./views/user-page.js'),
          slots: [
              {
                  'top-bar': 'admin-topbar',
                  import: () => import('./partials/admin-top-bar.js'),
              },
          ],
      },
  ];

  const router = new SimplrRouter({ routes, debugging: true });
  router.init();
```