import { LitElement, css } from 'lit-element';

export class ViewTemplate extends LitElement {
    static get styles() {
        return css`
            :host {
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                font-size: 1.6rem;
                color: #1a2b42;
                max-width: 960px;
                margin: 2.5% 10%;
                text-align: center;
            }
        `;
    }
}
