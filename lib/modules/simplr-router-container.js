export default class SimplrRouterContainer extends HTMLElement {
    static initialize(transitionSpeed) {
        customElements.define('simplr-router-container', SimplrRouterContainer);
        const styleNode = document.createElement('style');
        styleNode.innerHTML = SimplrRouterContainer.styles.replace('{transitionSpeed}', transitionSpeed);
        document.head.prepend(styleNode);
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.tabIndex = 0;
    }

    transition() {
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
    }

    transitionOut(direction) {
        this.setAttribute(direction, '');
        this.addEventListener('transitionend', () => this.remove());
    }

    static styles = `
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
    }
    simplr-router-container[from-left], simplr-router-container[to-left] {
        -webkit-transform: translateX(-100%); transform: translateX(-100%);
    }
    simplr-router-container[from-right], simplr-router-container[to-right] {
        -webkit-transform: translateX(100%); transform: translateX(100%);
    }

    `;
}
