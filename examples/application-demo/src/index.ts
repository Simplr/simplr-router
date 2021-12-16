import { SimplrRouter, SimplrRouterOptions } from "@simplr-wc/router";
import "./components/SideNav";

const routerOptions: SimplrRouterOptions = {
    routes: [
        { name: "Home", path: "/", component: "landing-page", import: () => import("./views/LandingPage") },
        { name: "Data", path: "/data", component: "data-page", import: () => import("./views/DataPage") },
        { name: "About", path: "/about", component: "about-page", import: () => import("./views/AboutPage") }
    ]
};

const router = new SimplrRouter(routerOptions);
router.init();
