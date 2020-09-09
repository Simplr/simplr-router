const routes = [
    {
        path: '/',
        component: 'router-docs-root',
        import: '/src/views/root-view.js',
        name: 'Home',
    },
    {
        path: '/getting-started',
        component: 'router-docs-getting-started',
        import: '/src/views/getting-started.js',
        name: 'Getting started',
    },
    {
        path: '/api-description',
        component: 'router-docs-api-description',
        import: '/src/views/api-description.js',
        name: 'API description',
    },
];

export default routes;
