const e = document.createElement('template');
e.innerHTML = '\n<pre><code><slot></slot></code></pre>\n';
const t = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.0.0/build';
class s extends HTMLElement {
    constructor() {
        super(), (this._lang = ''), (this._theme = 'zenburn');
        this.attachShadow({ mode: 'open' }).appendChild(e.content.cloneNode(!0)),
            this._loadHighlightJs();
    }
    static get observedAttributes() {
        return ['lang', 'theme'];
    }
    attributeChangedCallback(e, t, s) {
        if (t !== s)
            switch (e) {
                case 'lang':
                    this._lang = s;
                    break;
                case 'theme':
                    this._theme = s;
            }
    }
    connectedCallback() {
        (this.shadowRoot.querySelector('code').className = 'lang-' + this._lang),
            this._loadStyles(),
            this._parseCode();
    }
    _parseCode() {
        let e = this.innerHTML
            .replace(new RegExp(/</g), '&#60;')
            .replace(new RegExp(/>/g), '&#62;')
            .replace(new RegExp(/^\n|\n$/g), '')
            .trimEnd();
        (this.shadowRoot.querySelector('code').innerHTML = e),
            (this.innerHTML = ''),
            this._initHighlight();
    }
    async _initHighlight() {
        for (; !this._isHighlightJsImported(); ) await new Promise((e) => setTimeout(e, 50));
        this.shadowRoot.querySelectorAll('pre code').forEach((e) => {
            hljs.highlightBlock(e);
        });
    }
    _isJsScriptTagAppended() {
        const e = Array.from(document.head.querySelectorAll('script')),
            t = 'https://' + this._getJsMinUrl();
        return e.filter((e) => e.src === t).length > 0;
    }
    _getJsMinUrl() {
        return t + '/highlight.min.js';
    }
    _loadHighlightJs() {
        if (!this._isHighlightJsImported() && !this._isJsScriptTagAppended()) {
            const e = this._getJsMinUrl(),
                t = document.createElement('script');
            (t.src = e), (t.type = 'text/javascript'), document.head.appendChild(t);
        }
    }
    _isHighlightJsImported() {
        return 'undefined' != typeof hljs;
    }
    _loadStyles() {
        const e = `${t}/styles/${this._theme}.min.css`,
            s = document.createElement('link');
        (s.rel = 'stylesheet'), (s.href = e), this.shadowRoot.prepend(s);
    }
}
customElements.get('highlight-js') || customElements.define('highlight-js', s);
