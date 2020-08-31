import SimplrRouter, { TransitionSpeed, TransitionDirection } from '../lib/simplr-router';
import './views.js';

const routes = [
    {
        path: '',
        view: 'blue-view',
    },
    {
        path: 'blue',
        view: 'blue-view',
    },
    {
        path: 'green',
        view: 'green-view',
    },
    {
        path: 'red',
        view: 'red-view',
    },
    {
        path: 'yellow',
        view: 'yellow-view',
    },
];

const options = {
    routes: routes,
    transitionSpeed: TransitionSpeed.SLOW,
    transitionDirection: TransitionDirection.LEFT,
    debugging: true,
};

const router = new SimplrRouter(options);

router.init();
