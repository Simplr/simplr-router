import {html, LitElement} from 'lit-element';

class SimplrFooWithIdInfo extends LitElement {
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
            <p>Foo with id: ${this.fooId} INFO</p>
        `;
    }

    createRenderRoot() {
        return this;
    }
}

if (!customElements.get('simplr-foo-with-id-info')) {
    customElements.define('simplr-foo-with-id-info', SimplrFooWithIdInfo);
}