import {html, LitElement} from 'lit-element';

class SimplrFooWithId extends LitElement {
    static get properties() {
        return {
            lang: {type: String},
            fooId: {type: String}
        };
    }

    constructor() {
        super();
        this.fooId = "";
    }

    render() {
        return html`
            <p>Foo with id: ${this.fooId}</p>
            <a href="foo/${this.fooId}/info" data-simplr-route>foo ${this.fooId} info</a>
        `;
    }

    createRenderRoot() {
        return this;
    }
}

if (!customElements.get('simplr-foo-with-id')) {
    customElements.define('simplr-foo-with-id', SimplrFooWithId);
}