import { html } from 'lit-element';
import { ViewTemplate } from './view-template.js';
import 'highlight-js-wc';

export class RouterDocsTransitionStyling extends ViewTemplate {
    static get styles() {
        return [super.styles];
    }

    render() {
        return html`<h2>Transition Styling</h2>

            <p>
                If you don't want to use the default transitions provided by the
                Simplr Router, you can easily disable them and create your own
                transition states.
            </p>

            <p>
                To disable the transition, set the
                <code>disableTransition</code> property in the configuration
                object to false
            </p>
            <!-- prettier-ignore -->
            <highlight-js lang="javascript" theme="gruvbox-dark">

    const routes = [
                {
                    path: '',
                    component: 'router-docs-root',
                    import: () => import('./views/root-view.js'),
                },
            ],
        },
    ];

    const router = new SimplrRouter({ routes, disableTransition: true });
            </highlight-js>

            <p>
                The default transition will be disabled, and you can modify the
                new transition by settings styling to the transition in and
                transition out objects.
            </p>

            <p>An example of a project with a fade-in-out transition:</p>

            <!-- prettier-ignore -->
            <highlight-js lang="css" theme="gruvbox-dark">

      simplr-router-container[entering-view],
      simplr-router-container[leaving-view] {
        opacity: 0;
      }
            </highlight-js>

            <p>
                The <code>entering-view</code> attribute is set for pages
                entering the view (from the right in the default transition),
                and the <code>leaving-view</code> attribute is set for views
                leaving the main view.
            </p>

            <p>Feel free to experiment with ways that fit best for you :)</p> `;
    }
}

if (!customElements.get('router-docs-transition-styling')) {
    customElements.define(
        'router-docs-transition-styling',
        RouterDocsTransitionStyling
    );
}
