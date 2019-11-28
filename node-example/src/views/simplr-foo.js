import {html, LitElement} from 'lit-element';
import "./simplr-router-link";

export default class SimplrFoo extends LitElement {
    static get properties() {
        return {
            lang: {type: String},
            loadImages: {type: Boolean},
            loadMoreImages: {type: Boolean},
            loadEvenMoreImages: {type: Boolean},
            isLoading: {type: Boolean}
        };
    }

    constructor() {
        super();
        console.log("I have been constructed");
    }

    connectedCallback() {
        super.connectedCallback();
        console.log("I have connected");
        this.innerHTML = "<p>test</p>";
    }

    firstUpdated(_changedProperties) {
        this.doWaiting();
    }

    async doWaiting() {
        let loadTime = 500;
        this.isLoading = true;
        await this.wait(loadTime);
        this.loadImages = true;
        await this.wait(loadTime);
        this.loadMoreImages = true;
        await this.wait(loadTime);
        this.loadEvenMoreImages = true;
        this.isLoading = false;
    }

    wait(ms) {
        return new Promise((resolve) => {setTimeout(resolve, ms)});
    }

    render() {
        return html`
            <p>Foo</p>
            ${this.loadImages ? html`
            <img style="width: 200px" src="https://i.imgur.com/2ZDbOok.jpg"/>` : ''}
            ${this.loadMoreImages ? html`
            <img style="width: 200px" src="https://i.imgur.com/InFyAVW.jpg"/>` : ''}
            ${this.loadEvenMoreImages ? html`
            <img style="width: 200px" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/ESC_large_ISS022_ISS022-E-11387-edit_01.JPG"/>`: ''}
            <simplr-router-link route="foo/12" title="Foo 12"></simplr-router-link>
        `;
    }

    createRenderRoot() {
        return this;
    }
}

if (!customElements.get('simplr-foo')) {
    customElements.define('simplr-foo', SimplrFoo);
}