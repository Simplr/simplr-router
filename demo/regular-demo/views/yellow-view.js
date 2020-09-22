import ViewTemplate from '../views.js';

class YellowView extends ViewTemplate {
    constructor() {
        super();
        this.viewColor = 'yellow';
    }
}
customElements.define('yellow-view', YellowView);
