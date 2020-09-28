/* eslint-disable class-methods-use-this */
import { LitElement, html, css } from 'lit-element';
import SimplrRouter from '@simplr-wc/router';
import routes from '../routes.js';

export default class NavigationDrawer extends LitElement {
    static get properties() {
        return {
            views: { type: Array },
            open: { type: Boolean, attribute: true, reflect: true },
        };
    }

    static get styles() {
        return css`
            :host {
                position: fixed;
                display: flex;
                flex-direction: column;
                left: 0;
                top: 0;
                z-index: 10;
                background: #fff;
                height: 100vh;
                width: 15%;
                border-right: 1px solid #eaeaea;
            }

            h2 {
                padding: 0 1rem;
                font-size: 1.8rem;
            }

            .routes a {
                padding: 0.5rem;
                list-style: none;
                font-size: 1.6rem;
                text-decoration: none;
                border-left: 6px solid transparent;
                transition: 200ms ease-in-out;
                cursor: pointer;
                color: inherit;
                margin: 2px 0;
            }

            .routes a:hover,
            .routes a[highlight] {
                border-left: 6px solid #ff6d00;
            }

            .routes {
                display: flex;
                flex-direction: column;
                height: 80%;
            }

            .routes ul {
                display: flex;
                flex-direction: column;
                margin: 0 0 0.5rem 0;
            }

            .social-icons {
                font-size: 1.2rem;
                padding: 1rem;
                display: flex;
                flex-direction: column;
                text-align: right;
            }

            .social-icons a {
                color: inherit;
                text-decoration: none;
                margin: 5px 0;
            }

            @media only screen and (max-width: 900px) {
                :host {
                    overflow: hidden;
                    width: 0%;
                    transition: 100ms ease-in;
                }

                :host([open]) {
                    width: 100%;
                }

                :host([open])::after {
                    content: '';
                }

                :host::after {
                    content: '\\2630';
                    display: block;
                    position: fixed;
                    top: 1rem;
                    left: 1rem;
                    font-size: 2rem;
                }
            }
        `;
    }

    constructor() {
        super();
        this.views = [];
    }

    firstUpdated() {
        const options = {
            routes,
            debugging: true,
        };
        const router = new SimplrRouter(options);
        this.views = routes;
        router.init();

        this.addEventListener('click', e => {
            this.handleMenu();
        });
    }

    handleMenu() {
        if (this.open) {
            this.open = false;
        } else {
            this.open = true;
        }
    }

    shouldHighlightRow(path) {
        return path === window.location.pathname;
    }

    refreshList(e) {
        const path = e.path || (e.composedPath && e.composedPath());
        const target = path[0];
        window.requestAnimationFrame(() => {
            this.shadowRoot
                .querySelector('[highlight]')
                .removeAttribute('highlight');
            target.setAttribute('highlight', '');
        });
    }

    render() {
        return html`
            <h2>Simplr Router Docs</h2>
            <div class="routes">
                ${this.views.map(view => {
                    return html`<a
                            ?highlight=${this.shouldHighlightRow(view.path)}
                            href="${view.path}"
                            @click=${this.refreshList}
                            >${view.name}</a
                        >

                        ${view.routes
                            ? html` <ul>
                                  ${view.routes.map(r => {
                                      return html`<a
                                          ?highlight=${this.shouldHighlightRow(
                                              r.path
                                          )}
                                          href=${r.path}
                                          @click=${this.refreshList}
                                          >${r.name}</a
                                      >`;
                                  })}
                              </ul>`
                            : ''}`;
                })}
            </div>
            <div class="social-icons">
                <a
                    target="_blank"
                    href="https://github.com/Simplr/simplr-router"
                    rel="noreferrer"
                    >Github &#10148;</a
                >
                <a
                    target="_blank"
                    href="https://www.npmjs.com/package/@simplr-wc/router"
                    rel="noreferrer"
                    >NPM &#10148;</a
                >
                <a
                    target="_blank"
                    href="https://twitter.com/matsuuu_"
                    rel="noreferrer"
                    >Author &#10148;</a
                >
            </div>
        `;
    }
}

if (!customElements.get('router-docs-navigation-drawer')) {
    customElements.define('router-docs-navigation-drawer', NavigationDrawer);
}
