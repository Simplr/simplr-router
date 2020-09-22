import ViewTemplate from '../views.js';

class RedView extends ViewTemplate {
    constructor() {
        super();
        this.viewColor = 'red';
    }
}
customElements.define('red-view', RedView);
