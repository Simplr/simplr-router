import SimplrRouter, { changeView } from '../lib/simplr-router.js';

export default class ViewTemplate extends HTMLElement {
    connectedCallback() {
        const template = document.createElement('template');
        template.innerHTML = `
        <style>
            div {
                height: 100vh;
                width: 100vw;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: ${this.viewColor};
                font-size: 4rem;
                color: #FFF;

            }
        </style>
        <div>
            <p>Current view color:</p>
            <p>${this.viewColor.toUpperCase()}</p>
            <p>Click to cycle through pages</p>
            <a href="/color/blue" style="color: blue">Blue</a>
            <a href="/color/red" style="color: red">Red</a>
            <a href="/color/yellow" style="color: yellow">Yellow</a>
            <a href="/color/green" style="color: green">Green</a>
            <a href="/color/green/dark" style="color: darkgreen">Dark Green</a>
            <input type="text" placeholder="Input color name: e.g. 'lightblue'" />
            <input type="button" value="Go to color">
        </div>`;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        window.requestAnimationFrame(() => {
            this.shadowRoot.querySelector('input[type=button]').addEventListener('click', () => {
                const c = this.shadowRoot.querySelector('input[type=text]').value;
                changeView(`/custom/${c}`);
            });
        });
    }
}
