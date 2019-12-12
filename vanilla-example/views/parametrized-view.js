export default class SimplrRouterParamView extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<div class="container parametrized">
                <div class="wrapper">
                    <p>This page's route is <b>"parametrized-path/:paramId"</b></p>
                    <p>The page param is: ${this.getAttribute('paramId')}</p>
                    <p>The param can be easily fetched with <code>this.getAttribute('paramId')</code></p>
                </div>
            </div>`;
    }

    createRenderRoot() {
        return this;
    }
}

if (!customElements.get('simplr-router-parametrized-view')) {
    customElements.define(
        'simplr-router-parametrized-view',
        SimplrRouterParamView
    );
}
