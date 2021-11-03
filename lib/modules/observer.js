import { SimplrRouter } from '../simplr-router';
import { getEventPath, ForwardsTransitionObject, BackwardsTransitionObject } from './helper';

export class Observer {
    /**
     * @param {ObserverFunctions} functions
     */
    constructor(functions) {
        this._setAnchorListener(functions);
        this._setReturnActionListeners(functions);
    }

    /**
     * @param {ObserverFunctions} functions
     */
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
                        functions.changeView(ForwardsTransitionObject.from(newView), fullTargetPath);
                        break;
                    }
                }
            } while ((target = path.shift()));
        });
    }

    /**
     * @param {ObserverFunctions} functions
     */
    _setReturnActionListeners(functions) {
        window.addEventListener('popstate', () => {
            const newView = functions.getViewFromUrl();
            functions.changeView(BackwardsTransitionObject.from(newView));
        });
    }
}
