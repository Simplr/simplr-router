import './views/about.js';
import './views/contributing.js';
import './views/homepage.js';
import './views/parametrized-view.js';

const routes = [
    {
        path: '',
        view: 'simplr-router-homepage',
    },
    {
        path: 'about',
        view: 'simplr-router-about',
    },
    {
        path: 'contributing',
        view: 'simplr-router-contributing',
    },
    {
        path: 'parametrized-path/:paramId',
        view: 'simplr-router-parametrized-view',
    },
];

export default routes;
