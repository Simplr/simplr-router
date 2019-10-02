import {html, LitElement} from 'lit-element';

class SimplrFooBarWithId extends LitElement {
    static get properties() {
        return {
            lang: {type: String},
            fooId: {type: String},
            barId: {type: String}
        };
    }

    constructor() {
        super();
        this.fooId = "";
        this.barId = "";
    }

    render() {
        return html`
            <p>Foo with id: ${this.fooId}</p>
            <p>Bar with id: ${this.barId}</p>
        `;
    }

    createRenderRoot() {
        return this;
    }
}

if (!customElements.get('simplr-foo-bar-with-id')) {
    customElements.define('simplr-foo-bar-with-id', SimplrFooBarWithId);
}