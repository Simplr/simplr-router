import ViewTemplate from '../views.js';

class GreenView extends ViewTemplate {
    constructor() {
        super();
        this.viewColor = 'green';
    }
}
customElements.define('green-view', GreenView);
