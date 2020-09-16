import { L as LitElement, c as css } from './navigation-drawer-f3c0d088.js';

class ViewTemplate extends LitElement {
    static get styles() {
        return css`
            :host {
                min-height: 80vh;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
                font-size: 1.4rem;
                color: #1a2b42;
                margin: 2.5% auto;
                width: 60%;
            }

            highlight-js {
                width: 80%;
                text-align: start;
                font-size: 1.1rem;
            }

            table {
                background: #fff;
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

export { ViewTemplate as V };
