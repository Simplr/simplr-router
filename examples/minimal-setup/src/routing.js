import { SimplrRouter } from "@simplr-wc/router";
import "./minimal-setup.js";
import "./example-view.js";
import "./dynamic-view.js";

const routes = [
    { path: "", component: "minimal-setup" },
    { path: "example", component: "example-view", name: "Example" },
    { path: "dynamic/:id", component: "dynamic-view" },
    {
        path: "onlynumbers/:id",
        pattern: {
            id: "[0-9]+"
        },
        component: "dynamic-view"
    },
    {
        path: "onlynumbers/:id/thenword/:specialType",
        pattern: {
            id: "[0-9]+",
            specialType: "(foo|bar|baz)"
        },
        component: "dynamic-view"
    },
    {
        path: "/do-redirect", redirect: "/example"
    },
    {
        path: "/name-redirect", redirect: { name: "Example" }
    }
];

new SimplrRouter({ routes }).init();
