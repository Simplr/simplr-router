export const SimplrRouterOutletStyles = `
            html {
                height: 100%;
            }
            html, body {
                overflow-x: hidden;
            }
            simplr-router-container { 
                display: block;
                width: 100%; 
                height: 100%; 
                padding: 0;
                position: absolute;
                top: 0;
                left: 0;
                margin: 0;
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
            simplr-router-outlet {
                width: 100%;
                height: 100%;
                display: flex;
                position: relative;
            }
            `;

export function loadOutletStyles(target = document.body, transitionSpeed = 0) {
    const styleNode = document.createElement('style');
    styleNode.id = 'simplr-router-outlet-styles';
    styleNode.innerHTML = SimplrRouterOutletStyles;

    let rootNode = /** @type Document */ (target.getRootNode());
    if (rootNode === document) {
        document.head.prepend(styleNode);
    } else {
        rootNode.prepend(styleNode);
    }
    window.requestAnimationFrame(() => {
        const routerStyles = [...rootNode.styleSheets].filter(
            (ss) => /** @type Element */(ss.ownerNode).id === styleNode.id
        )[0];
        if (routerStyles) {
            /** @type CSSStyleRule */ (routerStyles.rules[1]).style.setProperty(
            '--transition-speed',
            transitionSpeed + 'ms'
        );
        }
    });
}

export class SimplrRouterOutlet extends HTMLElement {
    /**
     * @param {number} transitionSpeed
     */
    static initialize(transitionSpeed) {
        if (!customElements.get('simplr-router-outlet')) {
            customElements.define('simplr-router-outlet', SimplrRouterOutlet);
        }
        SimplrRouterOutlet.transitionSpeed = transitionSpeed;
    }

    connectedCallback() {
        loadOutletStyles(this, SimplrRouterOutlet.transitionSpeed);
    }
}
SimplrRouterOutlet.transitionSpeed = 0;
