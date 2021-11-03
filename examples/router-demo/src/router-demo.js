import { getBreadcrumbs, SimplrRouter } from '@simplr-wc/router';
import { RouterDemo } from './RouterDemo.js';
import "./forbidden-view.js";
import "./not-found-view.js";
import "./special-top-bar.js";
import "./regular-top-bar.js";

const routerOptions = {
    routes: [
        {
            name: "Home",
            path: "",
            component: "router-demo",
            slots: [
                {
                    'top-bar': 'regular-top-bar',
                },
            ],
        },
        {
            name: "Example",
            path: "example",
            component: "router-example",
            import: () => import("./router-example.js"),
            routes: [
                {
                    path: "foo",
                    component: "router-example",
                    import: () => import("./router-example.js"),
                }
            ]
        },
        { path: "", component: "simplr-router-demo" },
        {
            name: "Parameter",
            path: "param/:id",
            component: "param-example",
            import: () => import("./param-example.js")
        },
        {
            name: "Pattern number",
            path: "pattern/:id",
            component: "pattern-example",
            import: () => import("./pattern-example.js"),
            pattern: {
                id: "\\d+"
            },
            routes: [
                {
                    path: "/andname/:name",
                    component: "pattern-with-name-example",
                    import: () => import("./pattern-with-name-example.js"),
                    pattern: {
                        name: "[A-Za-z]+"
                    }
                }
            ]
        },
        {
            name: "Pattern word",
            path: "pattern/:word",
            component: "pattern-example",
            import: () => import("./pattern-example.js"),
            pattern: {
                word: "[A-Za-z]+"
            }
        },
        {
            name: "Redirect",
            path: "foo",
            redirect: "/example"
        },
        {
            name: "Redirect By name",
            path: "bar",
            redirect: { name: "Example" }
        },
        {
            path: 'special-home',
            component: 'router-demo',
            slots: [
                {
                    'top-bar': 'special-top-bar',
                },
            ],
        },
        {
            name: "Guarded",
            path: "guarded",
            component: "router-example",
            import: () => import("./router-example.js"),
            guard: () => {
                return Math.random() >= 0.5;
            }
        },
        {
            path: "not-found",
            component: "not-found-view"
        },
        {
            path: "forbidden",
            component: "forbidden-view"
        }
    ],
    transitionSpeed: 100,
    rootPath: "/my-app"
}

const router = new SimplrRouter(routerOptions);
router.init();
console.log(router.router.routes);

customElements.define('router-demo', RouterDemo);

addEventListener("keydown", () => {
    console.log(getBreadcrumbs());
})
