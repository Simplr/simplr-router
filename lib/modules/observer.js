import SimplrRouter from '@simplr-wc/router';
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
            do {
                if (target.href) {
                    const targetSplit = target.href.replace(origin, '').split("#");
                    const targetHref = targetSplit[0];
                    const hash = targetSplit.length > 1 ? "#" + targetSplit[1] : "";
                    const newView = functions.findViewForRoute(targetHref);
                    if (newView) {
                        e.preventDefault();
                        const fullTargetPath = targetHref + hash;
                        if (targetHref === SimplrRouter._instance.getCurrentView().path) {
                            break;
                        }
                        updateHistory(fullTargetPath);
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
