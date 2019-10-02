import { LitElement, html } from "@polymer/lit-element";
import SimplrRouter from "simplr-router";
import routes from "../simplr-routes";
import "./shadow-page";

class TestIndex extends LitElement {

    firstUpdated() {
            SimplrRouter.init(this, routes);
    }

    render() {
        console.log("Rendering");
        return html`
        <p>
            Hello world
        </p> <br>
        <a href="second-view" data-simplr-route>Go to second page</a>
        <div>
            <a href="second-view" data-simplr-route>Go to second page</a>
        </div>
        <shadow-page></shadow-page>`;
    }
}

customElements.define("test-index", TestIndex);