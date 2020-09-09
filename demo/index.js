import SimplrRouter from '../lib/simplr-router';
import './views.js';
import './views/red-view';

const routes = [
    {
        path: '',
        component: 'blue-view',
        import: '/demo/views/blue-view.js',
    },
    {
        path: 'color',
        component: 'blue-view',
        import: '/demo/views/blue-view.js',
        routes: [
            {
                path: 'blue',
                component: 'blue-view',
                import: '/demo/views/blue-view.js',
            },
            {
                path: 'red',
                component: 'red-view',
            },
            {
                path: 'green',
                component: 'green-view',
                import: '/demo/views/green-view.js',
                routes: [
                    {
                        path: 'dark',
                        component: 'dark-green-view',
                        import: '/demo/views/dark-green-view.js',
                    },
                ],
            },
            {
                path: 'yellow',
                component: 'yellow-view',
                import: '/demo/views/yellow-view.js',
            },
        ],
    },
    {
        path: 'custom/:viewColor',
        component: 'custom-color-view',
        import: '/demo/views/custom-view.js',
    },
];

const options = {
    routes: routes,
    transitionSpeed: 200,
    transitionDirection: 'from-left',
    debugging: true,
};

const router = new SimplrRouter(options);

router.init();

console.log(router.router.routes);
