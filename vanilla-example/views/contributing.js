export default class SimplrRouterContributing extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<div class="container contributing">
                            <div class="wrapper">
                                <h2>Contributing</h2>
                                    <p>You can contribute to the development of the library in many ways:</p>
                                    <ul>
                                        <li>Just use the library. It really motivates me to know that people use my library</li>
                                        <li>Star it on GitHub</li>
                                        <li>Shoot me a DM in <a href="https://twitter.com/matsutuss">Twitter</a></li>
                                        <li>Create an Issue on <a href="https://github.com/Matsuuu/simplr-router">GitHub</a> about a feature request of a bug you encountered</li>
                                        <li>Submit a PR</li>
                                    </ul>
                                </div>
                            </div>`;
    }

    createRenderRoot() {
        return this;
    }
}

if (!customElements.get('simplr-router-contributing')) {
    customElements.define(
        'simplr-router-contributing',
        SimplrRouterContributing
    );
}
