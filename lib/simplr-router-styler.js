import { TransitionDirection } from './simplr-router-transition-direction.js';

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
        let style = document.createElement('style');
        document.head.appendChild(style);
        router.styleElement = style;
        return style.sheet;
    }

    _addWrapperStyles(sheet) {
        sheet.insertRule(
            '.simplr-router-view-wrapper { ' +
                'display: block; ' +
                'width: 100%; ' +
                'height: 100%; ' +
                'padding: 0; ' +
                'margin: 0; ' +
                'position: absolute; ' +
                'background: #FFF; ' +
                'will-change: transform;' +
                '-webkit-transform: none;' +
                'transform: none;' +
                'overflow-y: auto;' +
                '}'
        );
        sheet.insertRule(
            '.simplr-router-loading-bar { ' +
                'width: 100%;' +
                'height:5px;' +
                'position: absolute;' +
                'top: 0;' +
                'left: 0;' +
                'overflow: hidden;' +
                'z-index: 99999;' +
                '}'
        );

        sheet.insertRule(
            '.simplr-router-loading-bar-indicator {' +
                'width: 5%;' +
                'height: 100%;' +
                'background: #FF6D00;' +
                'animation: simplr-loading;' +
                'animation-iteration-count: infinite;' +
                'animation-duration: 3s;' +
                'animation-timing-function: ease-out;' +
                'position: absolute;' +
                'top: 0;' +
                'left:-5%;' +
                'z-index:99999;' +
                '}'
        );

        sheet.insertRule(
            '@keyframes simplr-loading {' +
                '0% {left: -5%;} 65% {left: 105%;} 100% {left: 105%;}' +
                '}'
        );
    }

    _addWrapperAnimations(sheet, router) {
        let cssRule = '';
        let oppositeCssRule = '';
        let width = Math.max(window.innerWidth, window.outerWidth);
        let height = Math.max(window.innerHeight, window.outerHeight);
        switch (router.transitionDirection) {
            case TransitionDirection.RIGHT:
                cssRule = `-webkit-transform: translateX(${width}px); transform: translateX(${width}px);`;
                oppositeCssRule = `-webkit-transform: translateX(-${width}px); transform: translateX(-${width}px);`;
                break;
            case TransitionDirection.BOTTOM:
                cssRule = `-webkit-transform: translateY(${height}px); transform: translateY(${height}px);`;
                oppositeCssRule = `-webkit-transform: translateY(-${height}px); transform: translateY(-${height}px);`;
                break;
            case TransitionDirection.LEFT:
                cssRule = `-webkit-transform: translateX(-${width}px); transform: translateX(-${width}px);`;
                oppositeCssRule = `-webkit-transform: translateX(${width}px); transform: translateX(${width}px);`;
                break;
            case TransitionDirection.TOP:
                cssRule = `-webkit-transform: translateY(-${height}px); transform: translateY(-${height}px);`;
                oppositeCssRule = `-webkit-transform: translateY(${height}px); transform: translateY(${height}px);`;
                break;
            default:
                cssRule = `-webkit-transform: translateX(${width}px); transform: translateX(${width}px);`;
                oppositeCssRule = `-webkit-transform: translateX(-${width}px); transform: translateX(-${width}px);`;
                break;
        }
        sheet.insertRule(
            `.simplr-router-view-wrapper.${router.transitionDirection} {` +
                `${cssRule}` +
                `}`
        );
        sheet.insertRule(
            `.simplr-router-view-wrapper.${router._getOppositeTransitionDirection()} {` +
                `${oppositeCssRule}` +
                `}`
        );
    }

    _addAnimationSpeed(sheet, router) {
        let speed = router.transitionSpeed;
        sheet.insertRule(
            `.simplr-router-view-wrapper { transition: linear ${speed}s 0s;}`
        );
    }
}
