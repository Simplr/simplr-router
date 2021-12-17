import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import "./SideNavItem";

@customElement("side-nav")
export class SideNav extends LitElement {


    static get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: column;
                height: 100vh;
                width: 250px;
                background: grey;
                padding: 1rem 0;
                background: #2f2f2f;
                box-sizing: border-box;
            }

            .logo {
                display: flex;
                width: 100%;
                height: 100px;
                align-items: center;
                color: #FFF;
                font-size: 22px;
                font-weight: bold;
                margin-bottom: 6rem;
                padding: 0 1rem;
            }

            .logo img {
                height: 100px;
                filter: invert(1);
            }
        `;
    }

    render() {
        return html`
            <div class="logo">
                <img src="https://simplr.github.io/simplr-router/866a7333.png" />
                <label>Simplr Router</label>
            </div>
            <side-nav-item href="/" label="Home"></side-nav-item>
            <side-nav-item href="/data" label="Data fields"></side-nav-item>
            <side-nav-item href="/about" label="About"></side-nav-item>
            <side-nav-item external href="https://simplr.github.io/simplr-router/" label="Docs"></side-nav-item>
            <side-nav-item external href="https://github.com/Simplr/simplr-router/tree/master/examples/application-demo" label="Source"></side-nav-item>
        `;
    }
}
