import { SimplrRouter, SimplrRouterOptions } from "@simplr-wc/router";

const routerOptions: SimplrRouterOptions = {
    routes: [
        {
            name: "Home",
            path: "/",
            component: "landing-page",
            import: () => import("./views/LandingPage"),
        },
        {
            name: "Data",
            path: "/data",
            component: "data-page",
            import: () => import("./views/DataPage"),
            children: [
                {
                    path: "/",
                    component: "data-page-info",
                    import: () => import("./views/data-views/DataPageInfo"),
                },
                {
                    path: "/issues",
                    component: "data-page-issues",
                    import: () => import("./views/data-views/DataPageIssues"),
                    children: [
                        { path: ":issueNumber", component: "data-page-issue-panel", import: () => import("./views/data-views/DataPageIssuePanel") }
                    ]
                },
                {
                    path: "/pull-requests",
                    component: "data-page-pull-requests",
                    import: () =>
                        import("./views/data-views/DataPagePullRequests"),
                },
                {
                    path: "/commits",
                    component: "data-page-commits",
                    import: () => import("./views/data-views/DataPageCommits"),
                },
            ],
        },
        {
            name: "About",
            path: "/about",
            component: "about-page",
            import: () => import("./views/AboutPage"),
        },
    ],
    transitionSpeed: 50
};

const router = new SimplrRouter(routerOptions);
router.init();
