import SimplrRouter from '../../lib/simplr-router.js';
import './views.js';
import './views/red-view';

export const rootPath = '/regular-demo';

const routes = [
    {
        path: '',
        component: 'blue-view',
        import: () => import('./views/blue-view.js'),
    },
    {
        path: 'color',
        component: 'blue-view',
        import: () => import('./views/blue-view.js'),
        routes: [
            {
                path: 'blue',
                component: 'blue-view',
                import: () => import('./views/blue-view.js'),
            },
            {
                path: 'red',
                component: 'red-view',
            },
            {
                path: 'green',
                component: 'green-view',
                import: () => import('./views/green-view.js'),
                routes: [
                    {
                        path: 'dark',
                        component: 'dark-green-view',
                        import: () => import('./views/dark-green-view.js'),
                    },
                ],
            },
            {
                path: 'yellow',
                component: 'yellow-view',
                import: () => import('./views/yellow-view.js'),
            },
        ],
    },
    {
        path: 'custom/:viewColor',
        component: 'custom-color-view',
        import: () => import('./views/custom-view.js'),
    },
    {
        path: 'not-found',
        component: 'not-found-page',
        import: () => import('./views/not-found.js'),
    },
    {
        path: 'forbidden',
        component: 'forbidden-page',
        import: () => import('./views/forbidden-page.js'),
    },
];

const options = {
    routes: routes,
    debugging: true,
    rootPath: rootPath,
};

const router = new SimplrRouter(options);

router.init();

console.log(router.router.routes);
