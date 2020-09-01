export default class SimplrRouterContainer extends HTMLElement {
    static initialize() {
        customElements.define('simplr-router-container', SimplrRouterContainer);
        const styleNode = document.createElement('style');
        styleNode.innerHTML = SimplrRouterContainer.styles;
        document.head.appendChild(styleNode);
    }

    transition() {
        window.requestAnimationFrame(() => {
            if (this.hasAttribute('from-left')) {
                this.removeAttribute('from-left');
            }
            if (this.hasAttribute('from-right')) {
                this.removeAttribute('from-right');
            }
            if (this.previousWrapper) {
                this.previousWrapper.setAttribute(this.previousWrapperTransitionDirection, '');
            }
        });
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
    }
    simplr-router-container[from-right] {
        -webkit-transform: translateX(-100%); transform: translateX(-100%);
    }
    simplr-router-container[from-left] {
        -webkit-transform: translateX(100%); transform: translateX(100%);
    }

    simplr-router-container[slow] {
        transition: linear 1500ms 0s;
    }

    simplr-router-container[medium] {
        transition: linear 1000ms 0s;
    }

    simplr-router-container[fast] {
        transition: linear 500ms 0s;
    }

    simplr-router-container[very-fast] {
        transition: linear 200ms 0s;
    }

    `;
}
