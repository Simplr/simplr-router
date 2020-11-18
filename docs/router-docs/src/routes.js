const routes = [
    {
        path: '',
        component: 'router-docs-root',
        import: () => import('./views/root-view.js'),
        name: 'Home',
    },
    {
        path: '/getting-started',
        component: 'router-docs-getting-started',
        import: () => import('./views/getting-started.js'),
        name: 'Getting started',
    },
    {
        path: '/api-description',
        component: 'router-docs-api-description',
        import: () => import('./views/api-description.js'),
        name: 'API description',
    },
    {
        path: '/recipes',
        component: 'router-docs-recipes',
        import: () => import('./views/docs-recipes.js'),
        name: 'Recipes',
        routes: [
            {
                path: '/sub-routes',
                component: 'router-docs-sub-routes',
                import: () => import('./views/docs-sub-routes.js'),
                name: 'Sub routes',
            },
            {
                path: '/guards',
                component: 'router-docs-guards',
                import: () => import('./views/docs-guard.js'),
                name: 'Guards',
            },
            {
                path: '/error-pages',
                component: 'router-docs-error-pages',
                import: () => import('./views/docs-error-pages.js'),
                name: 'Error pages',
            },
            {
                path: '/code-splitting',
                component: 'router-docs-code-splitting',
                import: () => import('./views/docs-code-splitting.js'),
                name: 'Code splitting',
            },
            {
                path: '/slots',
                component: 'router-docs-slots',
                import: () => import('./views/docs-slots.js'),
                name: 'Slots',
            },
            {
                path: '/transition-styling',
                component: 'router-docs-transition-styling',
                import: () => import('./views/docs-transition-styling.js'),
                name: 'Transition styling',
            },
            {
                path: '/middleware',
                component: 'router-docs-middleware',
                import: () => import('./views/docs-middleware.js'),
                name: 'Middleware',
            },
        ],
    },
    {
        path: '/quick-start',
        component: 'router-docs-quick-start',
        import: () => import('./views/quick-start.js'),
        name: 'Quick start',
    },
];

export default routes;
