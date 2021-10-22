import { SimplrRouter } from '@simplr-wc/router';
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
            import: () => import("./router-example.js")
        },
        {
            name: "Parameter",
            path: "param/:id",
            component: "param-example",
            import: () => import("./param-example.js")
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
}

const router = new SimplrRouter(routerOptions);
router.init();

customElements.define('router-demo', RouterDemo);
