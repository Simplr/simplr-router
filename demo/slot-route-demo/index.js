import SimplrRouter from '../../lib/simplr-router.js';
import './views/index-view';
import './views/profile-view';

const routes = [
    {
        path: '/',
        component: 'index-view',
        slots: [
            {
                'top-bar': 'default-topbar',
                import: () => import('./partials/top-bar.js'),
            },
        ],
    },
    {
        path: '/profile',
        component: 'profile-view',
        slots: [
            {
                'top-bar': 'profile-top-bar',
                import: () => import('./partials/profile-top-bar.js'),
            },
            {
                'profile-sidebar': 'profile-side-bar',
                import: () => import('./partials/profile-side-bar.js'),
            },
        ],
    },
];

const options = { routes, rootPath: '/slot-route-demo', debugging: true };
const router = new SimplrRouter(options);

router.init();
console.log(router.router.routes);
