import { getBreadcrumbs, SimplrRouter } from '@simplr-wc/router';
import { RouterDemo } from './RouterDemo.js';
import "./forbidden-view.js";
import "./not-found-view.js";
import "./special-top-bar.js";
import "./regular-top-bar.js";

window.addEventListener("simplr-router-navigated", e => {
    const historyPath = e.detail.historyPath;
    const view = e.detail.view;
    console.log({ historyPath, view });
})

const siteOptions = {
    locale: "fi_FI",
    doc: document,
    someFunc: () => {
        console.log("You called somefunc. The locale will be changed");
        console.log(siteOptions);
        siteOptions.locale = siteOptions.locale === "fi_FI" ? "en_EN" : "fi_FI";
    }
}

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
            properties: { options: siteOptions },
            routes: [
                {
                    path: "foo",
                    component: "router-example",
                    import: () => import("./router-example.js"),
                }
            ]
        },
        {
            name: "Users",
            path: "users",
            component: "users-view",
            import: () => import("./users-view.js"),
            children: [
                {
                    path: "",
                    component: "users-list-view",
                    import: () => import("./users-list-view.js")
                },
                {
                    path: ":userId",
                    component: "user-profile-view",
                    import: () => import("./user-profile-view.js"),
                    pattern: { userId: "\\d+" },
                    children: [
                        {
                            path: "edit",
                            component: "user-edit-view",
                            import: () => import("./user-edit-view.js")
                        }
                    ]
                },
                {
                    path: "new",
                    component: "user-add-view",
                    import: () => import("./user-add-view.js")
                }
            ]
        },
        {
            name: "Prevent exit",
            path: "prevent",
            component: "prevent-example",
            preventUnload: true,
            import: () => import("./prevent-example.js")
        },
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
            guard: (viewParams) => {
                const roll = Math.random();
                viewParams.roll = roll;
                return roll >= 0.5;
            }
        },
        {
            name: "Guarded with param",
            path: "guarded/:id",
            component: "router-example",
            import: () => import("./router-example.js"),
            guard: (viewParams) => {
                console.log(viewParams);
                return viewParams.id > 0;
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
}

const router = new SimplrRouter(routerOptions);
router.init();
console.log(router.router.routes);
console.log(router.router.dynamicRoutes);
console.log(router.router.staticRoutes);

customElements.define('router-demo', RouterDemo);

addEventListener("keydown", () => {
    console.log(getBreadcrumbs());
})
