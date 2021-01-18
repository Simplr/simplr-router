import { LitElement, css } from '/node_modules/lit-element/lit-element.js';

export class ViewTemplate extends LitElement {
    static get styles() {
        return css`
            :host {
                min-height: 80vh;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
                font-size: 1.4rem;
                margin: 2.5% auto;
                width: 60%;
                background: #202330;
                color: #fae8b6;
            }

            a {
                color: #ddb97a;
            }

            highlight-js {
                width: 100%;
                text-align: start;
                font-size: 1.1rem;
            }

            table {
                background: #202330;
                color: #fae8b6;
                font-size: 1.2rem;
                border: 2px solid #484848;
                border-radius: 4px;
                padding: 1rem;
            }

            th,
            td {
                border-bottom: 1px solid #484848;
                padding: 1rem;
            }

            td:nth-child(1) {
                width: 20%;
                border-right: 1px solid #484848;
            }
            td:nth-child(2) {
                width: 35%;
            }
            td:nth-child(3) {
                border-left: 1px solid #484848;
            }

            tr:last-child td {
                border-bottom: unset;
            }

            @media only screen and (max-width: 900px) {
                :host {
                    width: 95%;
                    margin: 2.5% auto 10%;
                }

                highlight-js {
                    width: 100%;
                }
            }
        `;
    }
}
