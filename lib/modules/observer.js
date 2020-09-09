import { getEventPath, ForwardsTransitionObject, BackwardsTransitionObject } from './helper';

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
            do {
                if (target.href) {
                    const targetHref = target.href.replace(origin, '');
                    const newView = functions.findViewForRoute(targetHref);
                    if (newView) {
                        e.preventDefault();
                        window.history.pushState(null, '', newView.path);
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
