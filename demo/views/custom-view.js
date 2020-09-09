import ViewTemplate from '../views.js';

class CustomColorView extends ViewTemplate {
    constructor() {
        super();
    }
}
customElements.define('custom-color-view', CustomColorView);
