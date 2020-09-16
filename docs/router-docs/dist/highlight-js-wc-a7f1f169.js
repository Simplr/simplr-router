const template = document.createElement('template');
template.innerHTML = `
<pre><code><slot></slot></code></pre>
`;

const cdnUrl = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.0.0/build';

class HighlightJsWc extends HTMLElement {
    constructor() {
        super();
        this._lang = '';
        this._theme = 'zenburn';

        const root = this.attachShadow({ mode: 'open' });
        root.appendChild(template.content.cloneNode(true));

        this._loadHighlightJs();
    }

    static get observedAttributes() {
        return ['lang', 'theme'];
    }

    attributeChangedCallback(name, value, newValue) {
        if (value === newValue) {
            return;
        }
        switch (name) {
            case 'lang':
                this._lang = newValue;
                break;
            case 'theme':
                this._theme = newValue;
                break;
        }
    }

    connectedCallback() {
        this.shadowRoot.querySelector('code').className = `lang-${this._lang}`;
        this._loadStyles();
        this._parseCode();
    }

    _parseCode() {
        // Replace all of these yucky characters to that the HTML doesn't go fucky wucky
        // There's still some problems with HTML parsing tho. Need to check that out some time
        let codeString = this.innerHTML
            .replace(new RegExp(/</g), '&#60;')
            .replace(new RegExp(/>/g), '&#62;')
            .replace(new RegExp(/^\n|\n$/g), '')
            .trimEnd();
        this.shadowRoot.querySelector('code').innerHTML = codeString;
        // After yanking the content, we can delete the original content from the dom to save space
        this.innerHTML = '';
        this._initHighlight();
    }

    async _initHighlight() {
        while (!this._isHighlightJsImported()) {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
        this.shadowRoot.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
    }

    _isJsScriptTagAppended() {
        const scriptTags = Array.from(document.head.querySelectorAll('script'));
        const jsMinUrl = 'https://' + this._getJsMinUrl();

        return scriptTags.filter((tag) => tag.src === jsMinUrl).length > 0;
    }

    _getJsMinUrl() {
        return `${cdnUrl}/highlight.min.js`;
    }

    _loadHighlightJs() {
        if (!this._isHighlightJsImported() && !this._isJsScriptTagAppended()) {
            const jsMinUrl = this._getJsMinUrl();
            const scriptTag = document.createElement('script');
            scriptTag.src = jsMinUrl;
            scriptTag.type = 'text/javascript';
            document.head.appendChild(scriptTag);
        }
    }

    _isHighlightJsImported() {
        return typeof hljs !== 'undefined';
    }

    _loadStyles() {
        const styleUrl = `${cdnUrl}/styles/${this._theme}.min.css`;
        const styleTag = document.createElement('link');
        styleTag.rel = 'stylesheet';
        styleTag.href = styleUrl;
        this.shadowRoot.prepend(styleTag);
    }
}

if (!customElements.get('highlight-js')) {
    customElements.define('highlight-js', HighlightJsWc);
}
