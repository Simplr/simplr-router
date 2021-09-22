export default class SimplrRouterContainer extends HTMLElement {
    static initialize(transitionSpeed) {
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
                overflow-y: auto;    
                transition: linear ${transitionSpeed}ms 0s;
            }
            simplr-router-container[leaving-view] {
                background: #FFA;
            }

            simplr-router-container[entering-view] {
                background: #FFA;
            }
            `;

        const styleNode = document.createElement('style');
        styleNode.innerHTML = styles;
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
        if (this.transitionSpeed > 0) {
            this.addEventListener('transitionend', () => this.remove());
        } else {
            this.remove();
        }
        this.setAttribute(direction, '');
    }
}
