import { h as html } from './navigation-drawer-aa6af123.js';
import { V as ViewTemplate } from './view-template-f58507f7.js';

class RouterDocsRoot extends ViewTemplate {
    static get styles() {
        return [super.styles];
    }

    render() {
        return html`
            <h2>Simplr Router</h2>

            <p>
                Simplr Router is a easy to use, easy to setup Router for Web
                Components.
            </p>
            <p>
                Simplr Router creates seamless transitions between views, and
                provides smooth user experiences.
            </p>
            <p>
                Simplr Router ships with 0 dependencies, and weighs in at
                <a
                    href="https://bundlephobia.com/result?p=@simplr-wc/router"
                    rel="noreferrer"
                    target="_blank"
                    >just around 3kb</a
                >
            </p>
        `;
    }
}

if (!customElements.get('router-docs-root')) {
    customElements.define('router-docs-root', RouterDocsRoot);
}

export { RouterDocsRoot };
