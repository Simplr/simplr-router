import {TransitionDirection} from "./simplr-router-transition-direction";

export default class SimplrRouterStyler {

    constructor(router) {
        if (router.styleElement) {
            router.styleElement.remove();
        }
        const sheet = this._getStyleSheet(router);
        this._addWrapperStyles(sheet);
        this._addWrapperAnimations(sheet, router);
        this._addAnimationSpeed(sheet, router);
    }

    static addStyles(router) {
        new SimplrRouterStyler(router);
    }

    _getStyleSheet(router) {
        let style = document.createElement("style");
        document.head.appendChild(style);
        router.styleElement = style;
        return style.sheet;
    }

    _addWrapperStyles(sheet) {
        sheet.insertRule(".simplr-router-view-wrapper { " +
            "display: block; " +
            "width: 100%; " +
            "height: 100%; " +
            "padding: 0; " +
            "margin: 0; " +
            "position: absolute; " +
            "background: #FFF; " +
            "top: 0; " +
            "left: 0; " +
			"overflow-y: scroll;" +
            "}");
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
        sheet.insertRule(`.simplr-router-view-wrapper { transition: ease-in ${speed}s 0s;}`);
    }
}
