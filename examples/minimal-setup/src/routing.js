import { SimplrRouter } from "@simplr-wc/router";
import "./minimal-setup.js";
import "./example-view.js";
import "./dynamic-view.js";

const routes = [
    { path: "", component: "minimal-setup" },
    { path: "example", component: "example-view", name: "Example" },
    { path: "dynamic/:id", component: "dynamic-view" },
];

new SimplrRouter({ routes }).init();
