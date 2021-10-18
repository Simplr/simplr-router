import { SimplrRouter } from '@simplr-wc/router';
import { RouterDemo } from './RouterDemo.js';

const routerOptions = {
    routes: [
        {
            name: "Home",
            path: "",
            component: "router-frontpage",
            import: () => import("./router-frontpage.js")
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
        }
    ],
    transitionSpeed: 500
}

const router = new SimplrRouter(routerOptions);
router.init();

customElements.define('router-demo', RouterDemo);
