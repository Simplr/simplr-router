export default class SimplrRouterContainer extends HTMLElement {
    static initialize(transitionSpeed, disableTransition) {
        if (!customElements.get('simplr-router-container')) {
            customElements.define('simplr-router-container', SimplrRouterContainer);
        }

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

        this.disableTransition = disableTransition;
        const styleNode = document.createElement('style');
        styleNode.innerHTML = styles.replace('{transitionSpeed}', transitionSpeed);
        document.head.prepend(styleNode);
    }

    connectedCallback() {
        this.tabIndex = 0;
    }

    transition() {
        let oppositeTransitionDirection = 'leaving-view';
        this.addEventListener('transitionend', this.navigationCompleteCallback.bind(this), { once: true });
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
        this.addEventListener('transitionend', () => this.remove());
    }
}
