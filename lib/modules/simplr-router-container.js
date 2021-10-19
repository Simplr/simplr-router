export const SimplrRouterContainerStyles = `
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
                background: #FFFFFF;
                overflow-y: auto;
                transition: linear var(--transition-speed, 0ms) 0s;
            }
            simplr-router-container[leaving-view] {
                background: #FFFFFE;
            }

            simplr-router-container[entering-view] {
                background: #FFFFFE;
            }
            `;

export function loadContainerStyles(target = document.body, transitionSpeed = 0) {
    const styleNode = document.createElement('style');
    styleNode.id = 'simplr-router-container-styles';
    styleNode.innerHTML = SimplrRouterContainerStyles;

    target.ownerDocument.head.prepend(styleNode);
    window.requestAnimationFrame(() => {
        const routerStyles = [...document.styleSheets].filter((ss) => ss.ownerNode.id === styleNode.id)[0];
        if (routerStyles) {
            routerStyles.rules[1].style.setProperty('--transition-speed', transitionSpeed + 'ms');
        }
    });
}

export class SimplrRouterContainer extends HTMLElement {
    static initialize(transitionSpeed) {
        if (!customElements.get('simplr-router-container')) {
            customElements.define('simplr-router-container', SimplrRouterContainer);
        }
        loadContainerStyles(document.body, transitionSpeed);
    }

    connectedCallback() {
        this.tabIndex = 0;
    }

    transition() {
        let oppositeTransitionDirection = 'leaving-view';
        if (this.transitionSpeed > 0) {
            this.addEventListener('transitionend', () => this.navigationCompleteCallback(this), { once: true });
        } else {
            this.navigationCompleteCallback(this);
        }
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
        console.log("Transition out", this.transitionSpeed);;
        if (this.transitionSpeed > 0) {
            this.addEventListener('transitionend', () => this.remove());
        } else {
            this.remove();
        }
        this.setAttribute(direction, '');
    }
}
