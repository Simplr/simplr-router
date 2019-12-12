import SimplrRouter from '../node_modules/simplr-router/simplr-router.js';

export default class SimplrRouterAbout extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<div class="container about">
                                <div class="wrapper">
                                    <h2>About</h2>
                                    <div class="intro">
                                        <p>Simplr Router is a SPA Routing application designed to be used with <b>Web Components</b></p>
                                        <p>The Router can be initialized in a fast and easy manner and can be modified for your liking.</p>
                                    </div>
                                    <p>For example you can change the transition direction of pages to:</p>
                                    <div class="transition-buttons">
                                        <p class="transition-direction-changer" id="from-top">Top</p>
                                        <p class="transition-direction-changer"  id="from-bottom">Bottom</p>
                                        <p class="transition-direction-changer"  id="from-left">Left</p>
                                        <p class="transition-direction-changer"  id="from-right">Right</p>
                                    </div>
                                    <p>You can also set the transition speed of the router.</p>
                                    <div class="transition-buttons">
                                        <p class="transition-speed-changer" data-transition-speed="1.5">Slow</p>
                                        <p class="transition-speed-changer" data-transition-speed="1">Medium</p>
                                        <p class="transition-speed-changer" data-transition-speed="0.5">Fast</p>
                                        <p class="transition-speed-changer" data-transition-speed="0.2">Very fast</p>
                                    </div>
                                    <p>The router also of course supports parametrized routes too</p>
                                    <div class="transition-buttons">
                                        <p class="go-to-page" data-page-num="15">Go to page 15</p>
                                        <p class="go-to-page" data-page-num="30">Go to page 30</p>
                                        <p class="go-to-page" data-page-num="45">Go to page 45</p>
                                    </div>
                                    
				    <p><b>This site was created purely with Vanilla Javascript and the Simplr Router</b></p>
                                    <p>The router has even more cool features, which you can check out at the Github page or the NPM page:</p>
                                    <div class="page-buttons">
                                        <a href="https://github.com/Matsuuu/simplr-router" target="_blank"><i class="fab fa-github"></i></a>
                                        <a href="https://www.npmjs.com/package/simplr-router" target="_blank"><i class="fab fa-npm"></i></a>
                                    </div>
                                </div>
                           </div>`;
        this.setListeners();
    }

    setListeners() {
        Array.from(
            document.querySelectorAll('.transition-direction-changer')
        ).forEach(elem => {
            elem.addEventListener('click', e => {
                SimplrRouter.setTransitionDirection(elem.id);
            });
        });
        Array.from(
            document.querySelectorAll('.transition-speed-changer')
        ).forEach(elem => {
            elem.addEventListener('click', e => {
                SimplrRouter.setTransitionSpeed(elem.dataset.transitionSpeed);
            });
        });
        Array.from(document.querySelectorAll('.go-to-page')).forEach(elem => {
            elem.addEventListener('click', e => {
                SimplrRouter.navigateToPath(
                    `parametrized-path/${elem.dataset.pageNum}`
                );
            });
        });
    }

    createRenderRoot() {
        return this;
    }
}

if (!customElements.get('simplr-router-about')) {
    customElements.define('simplr-router-about', SimplrRouterAbout);
}
