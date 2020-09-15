import { html } from 'lit-element';
import { ViewTemplate } from './view-template';
import 'highlight-js-wc';

export default class RouterDocsQuickStart extends ViewTemplate {
    static get styles() {
        return [super.styles];
    }

    render() {
        return html`<h2>Quick start</h2>

            <p>
                Since Simplr Router works with Web Components, and doesn't rely
                on any libraries, you can run it in any existing project.
            </p>

            <p>
                However if you don't know how to get started, here's a quick
                start for initializing a project with
                <a href="https://open-wc.org/">Open-WC</a> and Simplr Router
            </p>

            <p><b>Initialize the project</b></p>
            <p>
                First we want a stable environment to develop on. We can get
                that by running <code>npm init @open-wc</code>.
            </p>
            <p>
                You can customize your environment, but a good choice is picking
                the building libraries for your project to have a nice bundle as
                output of our code.
            </p>

            <p><b>Install the router</b></p>

            <p>Next we will install the router for our application.</p>
            <p><code>npm install @simplr-wc/router</code></p>

            <p><b>Run the environment</b></p>
            <p>
                To run the environment, we run <code>npm run start</code>, which
                starts up the trusty es-dev-server.
            </p>

            <p><b>Clean-up</b></p>
            <p>
                Next we can remove the default Web Component generated for our
                project, and just leave the <code>script</code> -tag in the
                <code>index.html</code> body.
            </p>

            <p><b>Initialize router</b></p>
            <p>
                Next we will initialize the router in the javascript file that
                was imported by our <code>index.html</code> -file
            </p>

            <!-- prettier-ignore -->
            <highlight-js theme="gruvbox-dark" lang="javascript">
    import SimplrRouter from '@simplr-wc/router';

    const routes = [
      {
        path: '',
        component: 'hello-world',
        import: () => import('./views/hello-world.js'),
      },
      {
        path: 'hello/:userName',
        component: 'hello-world',
        import: () => import('./views/hello-world.js'),
      },
    ];

    const router = new SimplrRouter({ routes });
    router.init();
 
            </highlight-js>

            <p><b>Creating the view</b></p>
            <p>
                Next we'll just create the <code>hello-world</code> Web
                Component
            </p>

            <!-- prettier-ignore -->
            <highlight-js theme="gruvbox-dark" lang="javascript">
    import { LitElement, html } from 'lit-element';
    import { changeView } from '@simplr-wc/router';

    export default class HelloWorld extends LitElement {
      static get properties() {
        return {
          userName: { type: String },
        };
      }

      constructor() {
        super();
        this.userName = 'World';
      }

      greetPerson() {
        const name = this.shadowRoot.querySelector("input[name='user-name-input']")
          .value;
        if (name) {
          changeView(\`/hello/\${name}\`);
        }
      }

      render() {
        return html\`<p>Hello \${this.userName}</p>

          <input type="text" name="user-name-input" />
          <input type="button" @click=\${this.greetPerson} value="Greet" /> \`;
      }
    }

    if (!customElements.get('hello-world')) {
      customElements.define('hello-world', HelloWorld);
    }

            </highlight-js>

            <p>
                Now if we just refresh the page, we will see ourselves getting
                greeted with a "Hello World", and if we input our name into the
                the input field and press the button, we will be immediately
                transported to the next view, without a page load.
            </p>

            <p><b>Building</b></p>
            <p>
                To publish your project as a bundle, you most likely want to
                bundle the dependencies with it. To do this we use Rollup.
            </p>
            <p>
                If you chose rollup in the init phase, you should be able to
                just run <code>npm run build</code>, and have a working
                application in your <code>dist</code> -folder.
            </p>

            <p>
                Just make sure that when you're deploying your application to a
                server, that you have History API fallback set, so the router
                will be able to navigate.
            </p>`;
    }
}

if (!customElements.get('router-docs-quick-start')) {
    customElements.define('router-docs-quick-start', RouterDocsQuickStart);
}
