import SimplrRouter from '../../lib/simplr-router.js';

const routes = [
    {
        path: '/',
        component: 'index-component',
        slots: [
            {
                topBar: 'default-topbar',
                import: () => import('./partials/top-bar.js'),
            },
        ],
    },
    {
        path: '/profile',
        component: 'profile-component',
        slots: [
            {
                topBar: 'profile-topbar',
                import: () => import('./partials/profile-top-bar.js'),
            },
        ],
    },
];

const options = { routes, rootPath: '/demo/slot-route-demo' };
const router = new SimplrRouter(options);

router.init();
