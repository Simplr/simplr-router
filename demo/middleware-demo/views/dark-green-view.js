import ViewTemplate from '../views.js';

class DarkGreenView extends ViewTemplate {
    constructor() {
        super();
        this.viewColor = 'darkgreen';
    }
}
customElements.define('dark-green-view', DarkGreenView);
