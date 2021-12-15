import { SimplrRouter, SimplrRouterOptions } from "@simplr-wc/router";

const routerOptions: SimplrRouterOptions = {
    routes: [
        { name: "Home", path: "/", component: "landing-page", import: () => import("./views/LandingPage") }
    ]
};

const router = new SimplrRouter(routerOptions);
router.init();
