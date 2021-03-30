import { getEventPath, ForwardsTransitionObject, BackwardsTransitionObject, updateHistory } from './helper';

export default class Observer {
    constructor(functions) {
        this._setAnchorListener(functions);
        this._setReturnActionListeners(functions);
    }

    _setAnchorListener(functions) {
        document.body.addEventListener('click', (e) => {
            const path = getEventPath(e);
            let target = path.shift();
            const origin = window.location.origin;
            const currentPath = window.location.pathname;
            do {
                if (target.href) {
                    const targetHref = target.href.replace(origin, '');
                    // If we are already on said page, don't navigate
                    if (currentPath === targetHref) {
                        e.preventDefault();
                        break;
                    }
                    const newView = functions.findViewForRoute(targetHref);
                    if (newView) {
                        e.preventDefault();
                        updateHistory(targetHref);
                        functions.changeView(new ForwardsTransitionObject(newView));
                        break;
                    }
                }
            } while ((target = path.shift()));
        });
    }

    _setReturnActionListeners(functions) {
        window.addEventListener('popstate', () => {
            const newView = functions.getViewFromUrl();
            functions.changeView(new BackwardsTransitionObject(newView));
        });
    }
}
