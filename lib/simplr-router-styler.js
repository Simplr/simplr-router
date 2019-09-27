import {TransitionDirection} from "./simplr-router-transition-direction";

export default class SimplrRouterStyler {

    constructor(router) {
        const sheet = new CSSStyleSheet();
        this._addWrapperStyles(sheet);
        this._addWrapperAnimations(sheet, router);
        this._addAnimationSpeed(sheet, router);

        document.adoptedStyleSheets = [sheet];
    }

    static addStyles(router) {
        new SimplrRouterStyler(router);
    }

    _addWrapperStyles(sheet) {
        sheet.insertRule(".simplr-router-view-wrapper {" +
            "display: block;" +
            "width: 100%;" +
            "height: 100%;" +
            "padding: 0;" +
            "margin: 0;" +
            "position: absolute;" +
            "background:#FFF;" +
            "top: 0;left:0;");
    }

    _addWrapperAnimations(sheet, router) {
        let cssRule = "";
        switch(router.transitionDirection) {
            case TransitionDirection.RIGHT:
                cssRule = `left: ${window.outerWidth}px`;
                break;
            case TransitionDirection.BOTTOM:
                cssRule = `top: ${window.outerHeight}px;`;
                break;
            case TransitionDirection.LEFT:
                cssRule = `left: -${window.outerWidth}px`;
                break;
            case TransitionDirection.TOP:
                cssRule = `top: -${window.outerHeight}px;`;
                break;
        }
        sheet.insertRule(`.simplr-router-view-wrapper.${router.transitionDirection} {` +
            `${cssRule}` +
            `}`);
    }

    _addAnimationSpeed(sheet, router) {
        let speed = router.transitionSpeed;
        sheet.insertRule(`.simplr-router-view-wrapper { transition: ease-in ${speed}s 0s;`);
    }
}