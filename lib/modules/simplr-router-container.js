import Dispatcher from './dispatcher';

export default class SimplrRouterContainer extends HTMLElement {
    static initialize(transitionSpeed, disableTransition) {
        customElements.define('simplr-router-container', SimplrRouterContainer);

        const styles = `
            html, body {
                overflow-x: hidden;
            }

            simplr-router-container { 
                display: block;
                width: 100%; 
                height: 100%; 
                padding: 0;
                margin: 0;
                position: absolute;
                top: 0;
                left: 0;
                background: #FFF;
                will-change: transform;
                -webkit-transform: none;
                transform: none;
                overflow-y: auto;    
                transition: linear {transitionSpeed}ms 0s;
                --leaving-view-transition: translateX(-100%);
                --entering-view-transition: translateX(100%);
            }
            
            ${
                disableTransition
                    ? ''
                    : `
            simplr-router-container[leaving-view] {
                -webkit-transform: var(--leaving-view-transition);
                transform: var(--leaving-view-transition);
            }

            simplr-router-container[entering-view] {
                -webkit-transform: var(--entering-view-transition);
                transform: var(--entering-view-transition);
            }

        `
            }`;

        const styleNode = document.createElement('style');
        styleNode.innerHTML = styles.replace('{transitionSpeed}', transitionSpeed);
        document.head.prepend(styleNode);
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.tabIndex = 0;
    }

    transition() {
        /*
        let oppositeTransitionDirection = 'to-left';
        window.requestAnimationFrame(() => {
            if (this.hasAttribute('from-left')) {
                this.removeAttribute('from-left');
                oppositeTransitionDirection = 'to-right';
            }
            if (this.hasAttribute('from-right')) {
                this.removeAttribute('from-right');
            }
            if (this.previousView) {
                this.previousView.transitionOut(oppositeTransitionDirection);
            }
        });
        */
        let oppositeTransitionDirection = 'leaving-view';
        window.requestAnimationFrame(() => {
            if (this.hasAttribute('leaving-view')) {
                this.removeAttribute('leaving-view');
                oppositeTransitionDirection = 'entering-view';
            }
            if (this.hasAttribute('entering-view')) {
                this.removeAttribute('entering-view');
            }
            if (this.previousView) {
                this.previousView.transitionOut(oppositeTransitionDirection);
            }
        });
    }

    transitionOut(direction) {
        this.setAttribute(direction, '');
        this.addEventListener('transitionend', () => {
            Dispatcher.sendTransitionFinishEvent();
            this.remove();
        });
    }
}
