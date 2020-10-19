# Simplr-Router

Simplr Router is a easy to use, easy to setup Router for Web Components.

Simplr Router creates seamless transitions between views, and provides smooth user experiences.

Simplr Router ships with 0 dependencies, and weighs in at just around 3kb

Check out everything about using the library in [the docs](https://router.matsu.fi/)

### Getting started

To immeadiately get started using SimplrRouter, you can follow the Quick Start guide in the [docs](https://router.matsu.fi/quick-start)

### Example

[CodeSandBox](https://codesandbox.io/s/quirky-hill-330x0?fontsize=14&hidenavigation=1&theme=dark)

Getting started with Simplr Router is quick and easy:

```javascript
import SimplrRouter from '@simplr-wc/router';
import './views/hello-view.js';
import './views/root-view.js';

const routes = [
    {
        path: '/',
        component: 'root-view',
    },
    {
        path: '/hello',
        component: 'hello-view',
        routes: [
            {
                path: ':name',
                component: 'hello-view',
            },
        ],
    },
];

const routerOptions = {
    routes,
    debugging: true,
};

const router = new SimplrRouter(routerOptions);
router.init();
```
