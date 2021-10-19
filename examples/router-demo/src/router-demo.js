import { SimplrRouter } from '@simplr-wc/router';
import { RouterDemo } from './RouterDemo.js';

const routerOptions = {
    routes: [
        {
            name: "Home",
            path: "",
            component: "router-demo"
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
        }
    ],
    transitionSpeed: 500
}

const router = new SimplrRouter(routerOptions);
router.init();

customElements.define('router-demo', RouterDemo);
