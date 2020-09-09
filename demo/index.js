import SimplrRouter from '../lib/simplr-router-new';
import './views.js';

const routes = [
    {
        path: '',
        component: 'blue-view',
        import: '/demo/views/blue-view.js',
    },
    {
        path: 'blue',
        component: 'blue-view',
        import: '/demo/views/blue-view.js',
    },
    {
        path: 'green',
        component: 'green-view',
        import: '/demo/views/green-view.js',
    },
    {
        path: 'red',
        component: 'red-view',
        import: '/demo/views/red-view.js',
    },
    {
        path: 'yellow',
        component: 'yellow-view',
        import: '/demo/views/yellow-view.js',
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
