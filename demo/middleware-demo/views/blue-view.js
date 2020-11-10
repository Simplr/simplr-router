import ViewTemplate from '../views.js';

class BlueView extends ViewTemplate {
    constructor() {
        super();
        this.viewColor = 'blue';
    }
}
customElements.define('blue-view', BlueView);
