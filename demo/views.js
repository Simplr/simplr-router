import SimplrRouter from '../lib/simplr-router-new.js';

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
            <a href="/blue" style="color: blue">Blue</a>
            <a href="/red" style="color: red">Red</a>
            <a href="/yellow" style="color: yellow">Yellow</a>
            <a href="green" style="color: green">Green</a>
        </div>`;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    changeView() {
        let views = ['blue', 'red', 'yellow', 'green'];
        views = views.filter((view) => view !== `${this.viewColor}`);
        const newView = views[Math.floor(Math.random() * views.length)];
        SimplrRouter.goTo(newView);
    }
}
