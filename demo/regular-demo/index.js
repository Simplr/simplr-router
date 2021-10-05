import { SimplrRouter, changeView } from "../../lib/simplr-router.js";
import "./views.js";
import "./views/red-view";

window.changeView = changeView;

export const rootPath = "/regular-demo";

const routes = [
    {
        path: "",
        component: "blue-view",
        import: () => import("./views/blue-view.js"),
        title: "Index",
    },
    {
        path: "color",
        component: "blue-view",
        import: () => import("./views/blue-view.js"),
        title: "Color selection",
        routes: [
            {
                path: "blue",
                component: "blue-view",
                import: () => import("./views/blue-view.js"),
                title: "Blue view",
            },
            {
                path: "red",
                component: "red-view",
                title: "Red view",
            },
            {
                path: "green",
                component: "green-view",
                import: () => import("./views/green-view.js"),
                title: "Green view",
                routes: [
                    {
                        path: "dark",
                        component: "dark-green-view",
                        import: () => import("./views/dark-green-view.js"),
                        title: "Dark green view",
                        name: "dark green view"
                    },
                ],
            },
            {
                path: "yellow",
                component: "yellow-view",
                import: () => import("./views/yellow-view.js"),
                title: "Yellow view",
            },
        ],
    },
    {
        path: "custom/:viewColor",
        component: "custom-color-view",
        import: () => import("./views/custom-view.js"),
        title: "Custom color view",
        routes: [
            {
                path: "info",
                component: "custom-color-view",
                import: () => import("./views/custom-view.js"),
                title: "Custom color info view",
            },
        ],
    },
    {
        path: "not-found",
        component: "not-found-page",
        import: () => import("./views/not-found.js"),
    },
    {
        path: "forbidden",
        component: "forbidden-page",
        import: () => import("./views/forbidden-page.js"),
    },
];

const options = {
    routes: routes,
    debugging: true,
    rootPath: rootPath
};

const router = new SimplrRouter(options);

router.init();

console.log(router.router.routes);

window.addEventListener("keydown", () => {
    console.log(router.getBreadcrumbs());
});
