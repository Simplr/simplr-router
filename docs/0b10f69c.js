const t =
        'undefined' != typeof window &&
        null != window.customElements &&
        void 0 !== window.customElements.polyfillWrapFlushCallback,
    e = (t, e, s = null) => {
        for (; e !== s; ) {
            const s = e.nextSibling;
            t.removeChild(e), (e = s);
        }
    },
    s = `{{lit-${String(Math.random()).slice(2)}}}`,
    i = `\x3c!--${s}--\x3e`,
    n = new RegExp(`${s}|${i}`);
class r {
    constructor(t, e) {
        (this.parts = []), (this.element = e);
        const i = [],
            r = [],
            a = document.createTreeWalker(e.content, 133, null, !1);
        let c = 0,
            d = -1,
            u = 0;
        const {
            strings: p,
            values: { length: m },
        } = t;
        for (; u < m; ) {
            const t = a.nextNode();
            if (null !== t) {
                if ((d++, 1 === t.nodeType)) {
                    if (t.hasAttributes()) {
                        const e = t.attributes,
                            { length: s } = e;
                        let i = 0;
                        for (let t = 0; t < s; t++) o(e[t].name, '$lit$') && i++;
                        for (; i-- > 0; ) {
                            const e = p[u],
                                s = l.exec(e)[2],
                                i = s.toLowerCase() + '$lit$',
                                r = t.getAttribute(i);
                            t.removeAttribute(i);
                            const o = r.split(n);
                            this.parts.push({ type: 'attribute', index: d, name: s, strings: o }),
                                (u += o.length - 1);
                        }
                    }
                    'TEMPLATE' === t.tagName && (r.push(t), (a.currentNode = t.content));
                } else if (3 === t.nodeType) {
                    const e = t.data;
                    if (e.indexOf(s) >= 0) {
                        const s = t.parentNode,
                            r = e.split(n),
                            a = r.length - 1;
                        for (let e = 0; e < a; e++) {
                            let i,
                                n = r[e];
                            if ('' === n) i = h();
                            else {
                                const t = l.exec(n);
                                null !== t &&
                                    o(t[2], '$lit$') &&
                                    (n =
                                        n.slice(0, t.index) +
                                        t[1] +
                                        t[2].slice(0, -'$lit$'.length) +
                                        t[3]),
                                    (i = document.createTextNode(n));
                            }
                            s.insertBefore(i, t), this.parts.push({ type: 'node', index: ++d });
                        }
                        '' === r[a] ? (s.insertBefore(h(), t), i.push(t)) : (t.data = r[a]),
                            (u += a);
                    }
                } else if (8 === t.nodeType)
                    if (t.data === s) {
                        const e = t.parentNode;
                        (null !== t.previousSibling && d !== c) || (d++, e.insertBefore(h(), t)),
                            (c = d),
                            this.parts.push({ type: 'node', index: d }),
                            null === t.nextSibling ? (t.data = '') : (i.push(t), d--),
                            u++;
                    } else {
                        let e = -1;
                        for (; -1 !== (e = t.data.indexOf(s, e + 1)); )
                            this.parts.push({ type: 'node', index: -1 }), u++;
                    }
            } else a.currentNode = r.pop();
        }
        for (const t of i) t.parentNode.removeChild(t);
    }
}
const o = (t, e) => {
        const s = t.length - e.length;
        return s >= 0 && t.slice(s) === e;
    },
    a = (t) => -1 !== t.index,
    h = () => document.createComment(''),
    l = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
function c(t, e) {
    const {
            element: { content: s },
            parts: i,
        } = t,
        n = document.createTreeWalker(s, 133, null, !1);
    let r = u(i),
        o = i[r],
        a = -1,
        h = 0;
    const l = [];
    let c = null;
    for (; n.nextNode(); ) {
        a++;
        const t = n.currentNode;
        for (
            t.previousSibling === c && (c = null),
                e.has(t) && (l.push(t), null === c && (c = t)),
                null !== c && h++;
            void 0 !== o && o.index === a;

        )
            (o.index = null !== c ? -1 : o.index - h), (r = u(i, r)), (o = i[r]);
    }
    l.forEach((t) => t.parentNode.removeChild(t));
}
const d = (t) => {
        let e = 11 === t.nodeType ? 0 : 1;
        const s = document.createTreeWalker(t, 133, null, !1);
        for (; s.nextNode(); ) e++;
        return e;
    },
    u = (t, e = -1) => {
        for (let s = e + 1; s < t.length; s++) {
            const e = t[s];
            if (a(e)) return s;
        }
        return -1;
    };
const p = new WeakMap(),
    m = (t) => 'function' == typeof t && p.has(t),
    f = {},
    g = {};
class _ {
    constructor(t, e, s) {
        (this.__parts = []), (this.template = t), (this.processor = e), (this.options = s);
    }
    update(t) {
        let e = 0;
        for (const s of this.__parts) void 0 !== s && s.setValue(t[e]), e++;
        for (const t of this.__parts) void 0 !== t && t.commit();
    }
    _clone() {
        const e = t
                ? this.template.element.content.cloneNode(!0)
                : document.importNode(this.template.element.content, !0),
            s = [],
            i = this.template.parts,
            n = document.createTreeWalker(e, 133, null, !1);
        let r,
            o = 0,
            h = 0,
            l = n.nextNode();
        for (; o < i.length; )
            if (((r = i[o]), a(r))) {
                for (; h < r.index; )
                    h++,
                        'TEMPLATE' === l.nodeName && (s.push(l), (n.currentNode = l.content)),
                        null === (l = n.nextNode()) &&
                            ((n.currentNode = s.pop()), (l = n.nextNode()));
                if ('node' === r.type) {
                    const t = this.processor.handleTextExpression(this.options);
                    t.insertAfterNode(l.previousSibling), this.__parts.push(t);
                } else
                    this.__parts.push(
                        ...this.processor.handleAttributeExpressions(
                            l,
                            r.name,
                            r.strings,
                            this.options
                        )
                    );
                o++;
            } else this.__parts.push(void 0), o++;
        return t && (document.adoptNode(e), customElements.upgrade(e)), e;
    }
}
const w = window.trustedTypes && trustedTypes.createPolicy('lit-html', { createHTML: (t) => t }),
    y = ` ${s} `;
class S {
    constructor(t, e, s, i) {
        (this.strings = t), (this.values = e), (this.type = s), (this.processor = i);
    }
    getHTML() {
        const t = this.strings.length - 1;
        let e = '',
            n = !1;
        for (let r = 0; r < t; r++) {
            const t = this.strings[r],
                o = t.lastIndexOf('\x3c!--');
            n = (o > -1 || n) && -1 === t.indexOf('--\x3e', o + 1);
            const a = l.exec(t);
            e +=
                null === a
                    ? t + (n ? y : i)
                    : t.substr(0, a.index) + a[1] + a[2] + '$lit$' + a[3] + s;
        }
        return (e += this.strings[t]), e;
    }
    getTemplateElement() {
        const t = document.createElement('template');
        let e = this.getHTML();
        return void 0 !== w && (e = w.createHTML(e)), (t.innerHTML = e), t;
    }
}
const v = (t) => null === t || !('object' == typeof t || 'function' == typeof t),
    b = (t) => Array.isArray(t) || !(!t || !t[Symbol.iterator]);
class x {
    constructor(t, e, s) {
        (this.dirty = !0),
            (this.element = t),
            (this.name = e),
            (this.strings = s),
            (this.parts = []);
        for (let t = 0; t < s.length - 1; t++) this.parts[t] = this._createPart();
    }
    _createPart() {
        return new P(this);
    }
    _getValue() {
        const t = this.strings,
            e = t.length - 1,
            s = this.parts;
        if (1 === e && '' === t[0] && '' === t[1]) {
            const t = s[0].value;
            if ('symbol' == typeof t) return String(t);
            if ('string' == typeof t || !b(t)) return t;
        }
        let i = '';
        for (let n = 0; n < e; n++) {
            i += t[n];
            const e = s[n];
            if (void 0 !== e) {
                const t = e.value;
                if (v(t) || !b(t)) i += 'string' == typeof t ? t : String(t);
                else for (const e of t) i += 'string' == typeof e ? e : String(e);
            }
        }
        return (i += t[e]), i;
    }
    commit() {
        this.dirty && ((this.dirty = !1), this.element.setAttribute(this.name, this._getValue()));
    }
}
class P {
    constructor(t) {
        (this.value = void 0), (this.committer = t);
    }
    setValue(t) {
        t === f ||
            (v(t) && t === this.value) ||
            ((this.value = t), m(t) || (this.committer.dirty = !0));
    }
    commit() {
        for (; m(this.value); ) {
            const t = this.value;
            (this.value = f), t(this);
        }
        this.value !== f && this.committer.commit();
    }
}
class V {
    constructor(t) {
        (this.value = void 0), (this.__pendingValue = void 0), (this.options = t);
    }
    appendInto(t) {
        (this.startNode = t.appendChild(h())), (this.endNode = t.appendChild(h()));
    }
    insertAfterNode(t) {
        (this.startNode = t), (this.endNode = t.nextSibling);
    }
    appendIntoPart(t) {
        t.__insert((this.startNode = h())), t.__insert((this.endNode = h()));
    }
    insertAfterPart(t) {
        t.__insert((this.startNode = h())),
            (this.endNode = t.endNode),
            (t.endNode = this.startNode);
    }
    setValue(t) {
        this.__pendingValue = t;
    }
    commit() {
        if (null === this.startNode.parentNode) return;
        for (; m(this.__pendingValue); ) {
            const t = this.__pendingValue;
            (this.__pendingValue = f), t(this);
        }
        const t = this.__pendingValue;
        t !== f &&
            (v(t)
                ? t !== this.value && this.__commitText(t)
                : t instanceof S
                ? this.__commitTemplateResult(t)
                : t instanceof Node
                ? this.__commitNode(t)
                : b(t)
                ? this.__commitIterable(t)
                : t === g
                ? ((this.value = g), this.clear())
                : this.__commitText(t));
    }
    __insert(t) {
        this.endNode.parentNode.insertBefore(t, this.endNode);
    }
    __commitNode(t) {
        this.value !== t && (this.clear(), this.__insert(t), (this.value = t));
    }
    __commitText(t) {
        const e = this.startNode.nextSibling,
            s = 'string' == typeof (t = null == t ? '' : t) ? t : String(t);
        e === this.endNode.previousSibling && 3 === e.nodeType
            ? (e.data = s)
            : this.__commitNode(document.createTextNode(s)),
            (this.value = t);
    }
    __commitTemplateResult(t) {
        const e = this.options.templateFactory(t);
        if (this.value instanceof _ && this.value.template === e) this.value.update(t.values);
        else {
            const s = new _(e, t.processor, this.options),
                i = s._clone();
            s.update(t.values), this.__commitNode(i), (this.value = s);
        }
    }
    __commitIterable(t) {
        Array.isArray(this.value) || ((this.value = []), this.clear());
        const e = this.value;
        let s,
            i = 0;
        for (const n of t)
            (s = e[i]),
                void 0 === s &&
                    ((s = new V(this.options)),
                    e.push(s),
                    0 === i ? s.appendIntoPart(this) : s.insertAfterPart(e[i - 1])),
                s.setValue(n),
                s.commit(),
                i++;
        i < e.length && ((e.length = i), this.clear(s && s.endNode));
    }
    clear(t = this.startNode) {
        e(this.startNode.parentNode, t.nextSibling, this.endNode);
    }
}
class A {
    constructor(t, e, s) {
        if (
            ((this.value = void 0),
            (this.__pendingValue = void 0),
            2 !== s.length || '' !== s[0] || '' !== s[1])
        )
            throw new Error('Boolean attributes can only contain a single expression');
        (this.element = t), (this.name = e), (this.strings = s);
    }
    setValue(t) {
        this.__pendingValue = t;
    }
    commit() {
        for (; m(this.__pendingValue); ) {
            const t = this.__pendingValue;
            (this.__pendingValue = f), t(this);
        }
        if (this.__pendingValue === f) return;
        const t = !!this.__pendingValue;
        this.value !== t &&
            (t ? this.element.setAttribute(this.name, '') : this.element.removeAttribute(this.name),
            (this.value = t)),
            (this.__pendingValue = f);
    }
}
class C extends x {
    constructor(t, e, s) {
        super(t, e, s), (this.single = 2 === s.length && '' === s[0] && '' === s[1]);
    }
    _createPart() {
        return new N(this);
    }
    _getValue() {
        return this.single ? this.parts[0].value : super._getValue();
    }
    commit() {
        this.dirty && ((this.dirty = !1), (this.element[this.name] = this._getValue()));
    }
}
class N extends P {}
let E = !1;
(() => {
    try {
        const t = {
            get capture() {
                return (E = !0), !1;
            },
        };
        window.addEventListener('test', t, t), window.removeEventListener('test', t, t);
    } catch (t) {}
})();
class R {
    constructor(t, e, s) {
        (this.value = void 0),
            (this.__pendingValue = void 0),
            (this.element = t),
            (this.eventName = e),
            (this.eventContext = s),
            (this.__boundHandleEvent = (t) => this.handleEvent(t));
    }
    setValue(t) {
        this.__pendingValue = t;
    }
    commit() {
        for (; m(this.__pendingValue); ) {
            const t = this.__pendingValue;
            (this.__pendingValue = f), t(this);
        }
        if (this.__pendingValue === f) return;
        const t = this.__pendingValue,
            e = this.value,
            s =
                null == t ||
                (null != e &&
                    (t.capture !== e.capture || t.once !== e.once || t.passive !== e.passive)),
            i = null != t && (null == e || s);
        s &&
            this.element.removeEventListener(
                this.eventName,
                this.__boundHandleEvent,
                this.__options
            ),
            i &&
                ((this.__options = T(t)),
                this.element.addEventListener(
                    this.eventName,
                    this.__boundHandleEvent,
                    this.__options
                )),
            (this.value = t),
            (this.__pendingValue = f);
    }
    handleEvent(t) {
        'function' == typeof this.value
            ? this.value.call(this.eventContext || this.element, t)
            : this.value.handleEvent(t);
    }
}
const T = (t) => t && (E ? { capture: t.capture, passive: t.passive, once: t.once } : t.capture);
function k(t) {
    let e = F.get(t.type);
    void 0 === e && ((e = { stringsArray: new WeakMap(), keyString: new Map() }), F.set(t.type, e));
    let i = e.stringsArray.get(t.strings);
    if (void 0 !== i) return i;
    const n = t.strings.join(s);
    return (
        (i = e.keyString.get(n)),
        void 0 === i && ((i = new r(t, t.getTemplateElement())), e.keyString.set(n, i)),
        e.stringsArray.set(t.strings, i),
        i
    );
}
const F = new Map(),
    U = new WeakMap();
const O = new (class {
    handleAttributeExpressions(t, e, s, i) {
        const n = e[0];
        if ('.' === n) {
            return new C(t, e.slice(1), s).parts;
        }
        if ('@' === n) return [new R(t, e.slice(1), i.eventContext)];
        if ('?' === n) return [new A(t, e.slice(1), s)];
        return new x(t, e, s).parts;
    }
    handleTextExpression(t) {
        return new V(t);
    }
})();
'undefined' != typeof window &&
    (window.litHtmlVersions || (window.litHtmlVersions = [])).push('1.3.0');
const L = (t, ...e) => new S(t, e, 'html', O),
    M = (t, e) => `${t}--${e}`;
let $ = !0;
void 0 === window.ShadyCSS
    ? ($ = !1)
    : void 0 === window.ShadyCSS.prepareTemplateDom &&
      (console.warn(
          'Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1.'
      ),
      ($ = !1));
const j = (t) => (e) => {
        const i = M(e.type, t);
        let n = F.get(i);
        void 0 === n && ((n = { stringsArray: new WeakMap(), keyString: new Map() }), F.set(i, n));
        let o = n.stringsArray.get(e.strings);
        if (void 0 !== o) return o;
        const a = e.strings.join(s);
        if (((o = n.keyString.get(a)), void 0 === o)) {
            const s = e.getTemplateElement();
            $ && window.ShadyCSS.prepareTemplateDom(s, t), (o = new r(e, s)), n.keyString.set(a, o);
        }
        return n.stringsArray.set(e.strings, o), o;
    },
    q = ['html', 'svg'],
    z = new Set(),
    I = (t, e, s) => {
        z.add(t);
        const i = s ? s.element : document.createElement('template'),
            n = e.querySelectorAll('style'),
            { length: r } = n;
        if (0 === r) return void window.ShadyCSS.prepareTemplateStyles(i, t);
        const o = document.createElement('style');
        for (let t = 0; t < r; t++) {
            const e = n[t];
            e.parentNode.removeChild(e), (o.textContent += e.textContent);
        }
        ((t) => {
            q.forEach((e) => {
                const s = F.get(M(e, t));
                void 0 !== s &&
                    s.keyString.forEach((t) => {
                        const {
                                element: { content: e },
                            } = t,
                            s = new Set();
                        Array.from(e.querySelectorAll('style')).forEach((t) => {
                            s.add(t);
                        }),
                            c(t, s);
                    });
            });
        })(t);
        const a = i.content;
        s
            ? (function (t, e, s = null) {
                  const {
                      element: { content: i },
                      parts: n,
                  } = t;
                  if (null == s) return void i.appendChild(e);
                  const r = document.createTreeWalker(i, 133, null, !1);
                  let o = u(n),
                      a = 0,
                      h = -1;
                  for (; r.nextNode(); )
                      for (
                          h++, r.currentNode === s && ((a = d(e)), s.parentNode.insertBefore(e, s));
                          -1 !== o && n[o].index === h;

                      ) {
                          if (a > 0) {
                              for (; -1 !== o; ) (n[o].index += a), (o = u(n, o));
                              return;
                          }
                          o = u(n, o);
                      }
              })(s, o, a.firstChild)
            : a.insertBefore(o, a.firstChild),
            window.ShadyCSS.prepareTemplateStyles(i, t);
        const h = a.querySelector('style');
        if (window.ShadyCSS.nativeShadow && null !== h)
            e.insertBefore(h.cloneNode(!0), e.firstChild);
        else if (s) {
            a.insertBefore(o, a.firstChild);
            const t = new Set();
            t.add(o), c(s, t);
        }
    };
window.JSCompiler_renameProperty = (t, e) => t;
const H = {
        toAttribute(t, e) {
            switch (e) {
                case Boolean:
                    return t ? '' : null;
                case Object:
                case Array:
                    return null == t ? t : JSON.stringify(t);
            }
            return t;
        },
        fromAttribute(t, e) {
            switch (e) {
                case Boolean:
                    return null !== t;
                case Number:
                    return null === t ? null : Number(t);
                case Object:
                case Array:
                    return JSON.parse(t);
            }
            return t;
        },
    },
    D = (t, e) => e !== t && (e == e || t == t),
    W = { attribute: !0, type: String, converter: H, reflect: !1, hasChanged: D };
class B extends HTMLElement {
    constructor() {
        super(), this.initialize();
    }
    static get observedAttributes() {
        this.finalize();
        const t = [];
        return (
            this._classProperties.forEach((e, s) => {
                const i = this._attributeNameForProperty(s, e);
                void 0 !== i && (this._attributeToPropertyMap.set(i, s), t.push(i));
            }),
            t
        );
    }
    static _ensureClassProperties() {
        if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
            this._classProperties = new Map();
            const t = Object.getPrototypeOf(this)._classProperties;
            void 0 !== t && t.forEach((t, e) => this._classProperties.set(e, t));
        }
    }
    static createProperty(t, e = W) {
        if (
            (this._ensureClassProperties(),
            this._classProperties.set(t, e),
            e.noAccessor || this.prototype.hasOwnProperty(t))
        )
            return;
        const s = 'symbol' == typeof t ? Symbol() : '__' + t,
            i = this.getPropertyDescriptor(t, s, e);
        void 0 !== i && Object.defineProperty(this.prototype, t, i);
    }
    static getPropertyDescriptor(t, e, s) {
        return {
            get() {
                return this[e];
            },
            set(i) {
                const n = this[t];
                (this[e] = i), this.requestUpdateInternal(t, n, s);
            },
            configurable: !0,
            enumerable: !0,
        };
    }
    static getPropertyOptions(t) {
        return (this._classProperties && this._classProperties.get(t)) || W;
    }
    static finalize() {
        const t = Object.getPrototypeOf(this);
        if (
            (t.hasOwnProperty('finalized') || t.finalize(),
            (this.finalized = !0),
            this._ensureClassProperties(),
            (this._attributeToPropertyMap = new Map()),
            this.hasOwnProperty(JSCompiler_renameProperty('properties', this)))
        ) {
            const t = this.properties,
                e = [
                    ...Object.getOwnPropertyNames(t),
                    ...('function' == typeof Object.getOwnPropertySymbols
                        ? Object.getOwnPropertySymbols(t)
                        : []),
                ];
            for (const s of e) this.createProperty(s, t[s]);
        }
    }
    static _attributeNameForProperty(t, e) {
        const s = e.attribute;
        return !1 === s
            ? void 0
            : 'string' == typeof s
            ? s
            : 'string' == typeof t
            ? t.toLowerCase()
            : void 0;
    }
    static _valueHasChanged(t, e, s = D) {
        return s(t, e);
    }
    static _propertyValueFromAttribute(t, e) {
        const s = e.type,
            i = e.converter || H,
            n = 'function' == typeof i ? i : i.fromAttribute;
        return n ? n(t, s) : t;
    }
    static _propertyValueToAttribute(t, e) {
        if (void 0 === e.reflect) return;
        const s = e.type,
            i = e.converter;
        return ((i && i.toAttribute) || H.toAttribute)(t, s);
    }
    initialize() {
        (this._updateState = 0),
            (this._updatePromise = new Promise((t) => (this._enableUpdatingResolver = t))),
            (this._changedProperties = new Map()),
            this._saveInstanceProperties(),
            this.requestUpdateInternal();
    }
    _saveInstanceProperties() {
        this.constructor._classProperties.forEach((t, e) => {
            if (this.hasOwnProperty(e)) {
                const t = this[e];
                delete this[e],
                    this._instanceProperties || (this._instanceProperties = new Map()),
                    this._instanceProperties.set(e, t);
            }
        });
    }
    _applyInstanceProperties() {
        this._instanceProperties.forEach((t, e) => (this[e] = t)),
            (this._instanceProperties = void 0);
    }
    connectedCallback() {
        this.enableUpdating();
    }
    enableUpdating() {
        void 0 !== this._enableUpdatingResolver &&
            (this._enableUpdatingResolver(), (this._enableUpdatingResolver = void 0));
    }
    disconnectedCallback() {}
    attributeChangedCallback(t, e, s) {
        e !== s && this._attributeToProperty(t, s);
    }
    _propertyToAttribute(t, e, s = W) {
        const i = this.constructor,
            n = i._attributeNameForProperty(t, s);
        if (void 0 !== n) {
            const t = i._propertyValueToAttribute(e, s);
            if (void 0 === t) return;
            (this._updateState = 8 | this._updateState),
                null == t ? this.removeAttribute(n) : this.setAttribute(n, t),
                (this._updateState = -9 & this._updateState);
        }
    }
    _attributeToProperty(t, e) {
        if (8 & this._updateState) return;
        const s = this.constructor,
            i = s._attributeToPropertyMap.get(t);
        if (void 0 !== i) {
            const t = s.getPropertyOptions(i);
            (this._updateState = 16 | this._updateState),
                (this[i] = s._propertyValueFromAttribute(e, t)),
                (this._updateState = -17 & this._updateState);
        }
    }
    requestUpdateInternal(t, e, s) {
        let i = !0;
        if (void 0 !== t) {
            const n = this.constructor;
            (s = s || n.getPropertyOptions(t)),
                n._valueHasChanged(this[t], e, s.hasChanged)
                    ? (this._changedProperties.has(t) || this._changedProperties.set(t, e),
                      !0 !== s.reflect ||
                          16 & this._updateState ||
                          (void 0 === this._reflectingProperties &&
                              (this._reflectingProperties = new Map()),
                          this._reflectingProperties.set(t, s)))
                    : (i = !1);
        }
        !this._hasRequestedUpdate && i && (this._updatePromise = this._enqueueUpdate());
    }
    requestUpdate(t, e) {
        return this.requestUpdateInternal(t, e), this.updateComplete;
    }
    async _enqueueUpdate() {
        this._updateState = 4 | this._updateState;
        try {
            await this._updatePromise;
        } catch (t) {}
        const t = this.performUpdate();
        return null != t && (await t), !this._hasRequestedUpdate;
    }
    get _hasRequestedUpdate() {
        return 4 & this._updateState;
    }
    get hasUpdated() {
        return 1 & this._updateState;
    }
    performUpdate() {
        if (!this._hasRequestedUpdate) return;
        this._instanceProperties && this._applyInstanceProperties();
        let t = !1;
        const e = this._changedProperties;
        try {
            (t = this.shouldUpdate(e)), t ? this.update(e) : this._markUpdated();
        } catch (e) {
            throw ((t = !1), this._markUpdated(), e);
        }
        t &&
            (1 & this._updateState ||
                ((this._updateState = 1 | this._updateState), this.firstUpdated(e)),
            this.updated(e));
    }
    _markUpdated() {
        (this._changedProperties = new Map()), (this._updateState = -5 & this._updateState);
    }
    get updateComplete() {
        return this._getUpdateComplete();
    }
    _getUpdateComplete() {
        return this._updatePromise;
    }
    shouldUpdate(t) {
        return !0;
    }
    update(t) {
        void 0 !== this._reflectingProperties &&
            this._reflectingProperties.size > 0 &&
            (this._reflectingProperties.forEach((t, e) => this._propertyToAttribute(e, this[e], t)),
            (this._reflectingProperties = void 0)),
            this._markUpdated();
    }
    updated(t) {}
    firstUpdated(t) {}
}
B.finalized = !0;
const J =
        window.ShadowRoot &&
        (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow) &&
        'adoptedStyleSheets' in Document.prototype &&
        'replace' in CSSStyleSheet.prototype,
    X = Symbol();
class G {
    constructor(t, e) {
        if (e !== X)
            throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        this.cssText = t;
    }
    get styleSheet() {
        return (
            void 0 === this._styleSheet &&
                (J
                    ? ((this._styleSheet = new CSSStyleSheet()),
                      this._styleSheet.replaceSync(this.cssText))
                    : (this._styleSheet = null)),
            this._styleSheet
        );
    }
    toString() {
        return this.cssText;
    }
}
const Q = (t, ...e) => {
    const s = e.reduce(
        (e, s, i) =>
            e +
            ((t) => {
                if (t instanceof G) return t.cssText;
                if ('number' == typeof t) return t;
                throw new Error(
                    `Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`
                );
            })(s) +
            t[i + 1],
        t[0]
    );
    return new G(s, X);
};
(window.litElementVersions || (window.litElementVersions = [])).push('2.4.0');
const K = {};
class Y extends B {
    static getStyles() {
        return this.styles;
    }
    static _getUniqueStyles() {
        if (this.hasOwnProperty(JSCompiler_renameProperty('_styles', this))) return;
        const t = this.getStyles();
        if (Array.isArray(t)) {
            const e = (t, s) =>
                    t.reduceRight((t, s) => (Array.isArray(s) ? e(s, t) : (t.add(s), t)), s),
                s = e(t, new Set()),
                i = [];
            s.forEach((t) => i.unshift(t)), (this._styles = i);
        } else this._styles = void 0 === t ? [] : [t];
        this._styles = this._styles.map((t) => {
            if (t instanceof CSSStyleSheet && !J) {
                const e = Array.prototype.slice
                    .call(t.cssRules)
                    .reduce((t, e) => t + e.cssText, '');
                return new G(String(e), X);
            }
            return t;
        });
    }
    initialize() {
        super.initialize(),
            this.constructor._getUniqueStyles(),
            (this.renderRoot = this.createRenderRoot()),
            window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot && this.adoptStyles();
    }
    createRenderRoot() {
        return this.attachShadow({ mode: 'open' });
    }
    adoptStyles() {
        const t = this.constructor._styles;
        0 !== t.length &&
            (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow
                ? J
                    ? (this.renderRoot.adoptedStyleSheets = t.map((t) =>
                          t instanceof CSSStyleSheet ? t : t.styleSheet
                      ))
                    : (this._needsShimAdoptedStyleSheets = !0)
                : window.ShadyCSS.ScopingShim.prepareAdoptedCssText(
                      t.map((t) => t.cssText),
                      this.localName
                  ));
    }
    connectedCallback() {
        super.connectedCallback(),
            this.hasUpdated && void 0 !== window.ShadyCSS && window.ShadyCSS.styleElement(this);
    }
    update(t) {
        const e = this.render();
        super.update(t),
            e !== K &&
                this.constructor.render(e, this.renderRoot, {
                    scopeName: this.localName,
                    eventContext: this,
                }),
            this._needsShimAdoptedStyleSheets &&
                ((this._needsShimAdoptedStyleSheets = !1),
                this.constructor._styles.forEach((t) => {
                    const e = document.createElement('style');
                    (e.textContent = t.cssText), this.renderRoot.appendChild(e);
                }));
    }
    render() {
        return K;
    }
}
(Y.finalized = !0),
    (Y.render = (t, s, i) => {
        if (!i || 'object' != typeof i || !i.scopeName)
            throw new Error('The `scopeName` option is required.');
        const n = i.scopeName,
            r = U.has(s),
            o = $ && 11 === s.nodeType && !!s.host,
            a = o && !z.has(n),
            h = a ? document.createDocumentFragment() : s;
        if (
            (((t, s, i) => {
                let n = U.get(s);
                void 0 === n &&
                    (e(s, s.firstChild),
                    U.set(s, (n = new V(Object.assign({ templateFactory: k }, i)))),
                    n.appendInto(s)),
                    n.setValue(t),
                    n.commit();
            })(t, h, Object.assign({ templateFactory: j(n) }, i)),
            a)
        ) {
            const t = U.get(h);
            U.delete(h);
            const i = t.value instanceof _ ? t.value.template : void 0;
            I(n, h, i), e(s, s.firstChild), s.appendChild(h), U.set(s, t);
        }
        !r && o && window.ShadyCSS.styleElement(s.host);
    });
class Z {
    constructor(t) {
        this.debugging = t.debugging;
    }
    info(t) {
        this.debugging && console.log(t);
    }
    caution(t) {
        this.debugging && console.info(t);
    }
}
class tt {
    constructor(t) {
        this._parseOptions(t);
    }
    _parseOptions(t) {
        (this.debugging = t.debugging),
            (this.transitionSpeed = null == t.transitionSpeed ? 200 : t.transitionSpeed),
            (this.notFoundAction = t.notFoundAction),
            (this.forbiddenAction = t.forbiddenAction);
    }
}
class et {
    constructor() {}
    parseRoutes(t) {
        if (!t)
            throw Error(
                'No routes passed during initialization. \n\nPlease provide the routes in the initialization of Simplr Router.'
            );
        let e = [],
            s = [];
        return this._iterateRoutes(t, e, s), { dynamicRoutes: s, staticRoutes: e };
    }
    _iterateRoutes(t, e, s, i) {
        for (let n of t)
            n.path.includes(':')
                ? ((n.path = this.handleLeadingSlash(n.path)), s.push(n))
                : ((n.path = this.handleLeadingSlash(n.path)), e.push(n)),
                i && (n.guard || (n.guard = i.guard), (n.path = i.path + n.path)),
                n.routes && this._iterateRoutes(n.routes, e, s, n);
    }
    parseViewFromUrl() {
        return window.location.pathname.split('?')[0];
    }
    handleLeadingSlash(t) {
        return '/' !== t.substring(0, 1) && (t = '/' + t), t;
    }
    splitRouteParts(t) {
        const e = t.split(/\//);
        return e.shift(), e;
    }
    mapParametersForRoute(t, e) {
        t.params = {};
        for (let s in t.parts) {
            const i = t.parts[s];
            i.includes(':') && (t.params[i.substring(1)] = e[s]);
        }
    }
}
class st {
    async createComponentElement(t) {
        t.import && (await t.import());
        const e = document.createElement(t.component);
        return (
            t.params &&
                Object.keys(t.params).forEach((s) => {
                    e[s] = t.params[s];
                }),
            e
        );
    }
    createViewContainer(t, e) {
        const s = document.createElement('simplr-router-container');
        return (
            t.initialView || s.setAttribute(this._determineMovementDirection(t.backwards, e), ''), s
        );
    }
    _determineMovementDirection(t, e) {
        return t ? (e ? 'from-left' : 'to-right') : e ? 'from-right' : 'to-left';
    }
}
class it {
    constructor(t) {
        (this.view = t), (this.backwards = !1), (this.initialView = !1);
    }
}
class nt {
    constructor(t) {
        (this.view = t), (this.backwards = !0), (this.initialView = !1);
    }
}
class rt {
    constructor(t) {
        (this.view = t), (this.backwards = !1), (this.initialView = !0);
    }
}
const ot = (t) => window.history.pushState(null, '', t);
class at {
    constructor(t) {
        this._setAnchorListener(t), this._setReturnActionListeners(t);
    }
    _setAnchorListener(t) {
        document.body.addEventListener('click', (e) => {
            const s = (i = e).path || (i.composedPath && i.composedPath());
            var i;
            let n = s.shift();
            const r = window.location.origin;
            do {
                if (n.href) {
                    const s = n.href.replace(r, ''),
                        i = t.findViewForRoute(s);
                    if (i) {
                        e.preventDefault(), ot(i.path), t.changeView(new it(i));
                        break;
                    }
                }
            } while ((n = s.shift()));
        });
    }
    _setReturnActionListeners(t) {
        window.addEventListener('popstate', () => {
            const e = t.getViewFromUrl();
            t.changeView(new nt(e));
        });
    }
}
class ht {
    constructor(t, e, s) {
        (this.parser = new et()),
            (this.builder = new st()),
            (this.observer = new at(this._getObserverFunctions())),
            Object.assign(this, this.parser.parseRoutes(t)),
            (this.notFoundAction = e),
            (this.forbiddenAction = s),
            (this.transitionInProgress = !1);
    }
    _getObserverFunctions() {
        return {
            findViewForRoute: this.findViewForRoute.bind(this),
            changeView: this.changeView.bind(this),
            getViewFromUrl: this._getViewFromUrl.bind(this),
        };
    }
    get routes() {
        return [...this.staticRoutes, ...this.dynamicRoutes];
    }
    changeView(t) {
        this._checkViewValidity(t.view).then(() => {
            this.builder.createComponentElement(t.view).then((e) => {
                const s = this._wrapViewWithContainer(e, t);
                this._pushNewViewIntoDom(s);
            });
        });
    }
    _wrapViewWithContainer(t, e) {
        const s = this.builder.createViewContainer(e, !0);
        return (s.previousView = this.activeView), s.appendChild(t), s;
    }
    _pushNewViewIntoDom(t) {
        document.body.appendChild(t),
            (this.activeView = t),
            window.requestAnimationFrame(() => {
                t.transition();
            });
    }
    handleUrlPathing() {
        this.changeView(new rt(this._getViewFromUrl()));
    }
    findViewForRoute(t) {
        const e = this.parser.handleLeadingSlash(t);
        let s = this._findViewFromStaticRoutes(e);
        return s || (s = this._findViewFromDynamicRoutes(e)), s;
    }
    _checkViewValidity(t) {
        return new Promise(async (e, s) => {
            t || (this._handleNotFoundAction(), s()),
                (await this._guardFails(t)) && (this._handleForbiddenAction(), s()),
                e();
        });
    }
    async _guardFails(t) {
        return t.guard && 'function' == typeof t.guard && !(await t.guard.call());
    }
    _getViewFromUrl() {
        return this.findViewForRoute(this.parser.parseViewFromUrl());
    }
    _findViewFromStaticRoutes(t) {
        let e = null;
        for (let s of this.staticRoutes)
            if (s.path === t) {
                e = s;
                break;
            }
        return e;
    }
    _findViewFromDynamicRoutes(t) {
        const e = this.parser.splitRouteParts(t);
        let s = null;
        for (let t of this.dynamicRoutes) {
            if (
                (t.parts || (t.parts = this.parser.splitRouteParts(t.path)),
                t.parts.length !== e.length)
            )
                continue;
            let i = !0;
            for (let s in t.parts) {
                const n = t.parts[s],
                    r = e[s];
                if (!n.includes(':') && n !== r) {
                    i = !1;
                    break;
                }
            }
            if (i) {
                (s = t), this.parser.mapParametersForRoute(s, e);
                break;
            }
        }
        return s;
    }
    _handleNotFoundAction() {
        this.notFoundAction
            ? this.notFoundAction.call()
            : '/not-found' !== window.location.pathname && (window.location.href = '/not-found');
    }
    _handleForbiddenAction() {
        this.forbiddenAction
            ? this.forbiddenAction.call()
            : '/forbidden' !== window.location.pathname && (window.location.href = '/forbidden');
    }
}
class lt extends HTMLElement {
    static initialize(t) {
        customElements.define('simplr-router-container', lt);
        const e =
                '\n            html, body {\n                overflow-x: hidden;\n            }\n\n            simplr-router-container { \n                display: block;\n                width: 100%; \n                height: 100%; \n                padding: 0;\n                margin: 0;\n                position: absolute;\n                top: 0;\n                left: 0;\n                background: #FFF;\n                will-change: transform;\n                -webkit-transform: none;\n                transform: none;\n                overflow-y: auto;    \n                transition: linear {transitionSpeed}ms 0s;\n            }\n            simplr-router-container[from-left], simplr-router-container[to-left] {\n                -webkit-transform: translateX(-100%); transform: translateX(-100%);\n            }\n            simplr-router-container[from-right], simplr-router-container[to-right] {\n                -webkit-transform: translateX(100%); transform: translateX(100%);\n            }\n\n        ',
            s = document.createElement('style');
        (s.innerHTML = e.replace('{transitionSpeed}', t)), document.head.prepend(s);
    }
    constructor() {
        super();
    }
    connectedCallback() {
        this.tabIndex = 0;
    }
    transition() {
        let t = 'to-left';
        window.requestAnimationFrame(() => {
            this.hasAttribute('from-left') && (this.removeAttribute('from-left'), (t = 'to-right')),
                this.hasAttribute('from-right') && this.removeAttribute('from-right'),
                this.previousView && this.previousView.transitionOut(t);
        });
    }
    transitionOut(t) {
        this.setAttribute(t, ''), this.addEventListener('transitionend', () => this.remove());
    }
}
class ct {
    constructor(t) {
        if (void 0 === t) throw Error('Cannot initialize SimplrRouter without options.');
        (this.logger = new Z(t)),
            (this.config = new tt(t)),
            (this.routes = t.routes),
            (ct._instance = this);
    }
    init() {
        (this.router = new ht(
            this.routes,
            this.config.notFoundAction,
            this.config.forbiddenAction
        )),
            (this.routes = null),
            this.logger.info(this.router.routes.length + ' routes loaded.'),
            lt.initialize(this.config.transitionSpeed),
            this.router.handleUrlPathing();
    }
    changeView(t) {
        ot(t), this.router.changeView(new it(this.router.findViewForRoute(t)));
    }
}
const dt = [
    {
        path: '',
        component: 'router-docs-root',
        import: () => import('./cdfc316d.js'),
        name: 'Home',
    },
    {
        path: 'getting-started',
        component: 'router-docs-getting-started',
        import: () => import('./fc2d4ee1.js'),
        name: 'Getting started',
    },
    {
        path: 'api-description',
        component: 'router-docs-api-description',
        import: () => import('./37489b63.js'),
        name: 'API description',
    },
    {
        path: 'recipes',
        component: 'router-docs-recipes',
        import: () => import('./075b76df.js'),
        name: 'Recipes',
        routes: [
            {
                path: 'sub-routes',
                component: 'router-docs-sub-routes',
                import: () => import('./fc692130.js'),
                name: 'Sub routes',
            },
            {
                path: 'guards',
                component: 'router-docs-guards',
                import: () => import('./b399c56a.js'),
                name: 'Guards',
            },
            {
                path: 'error-pages',
                component: 'router-docs-error-pages',
                import: () => import('./c917836b.js'),
                name: 'Error pages',
            },
            {
                path: 'code-splitting',
                component: 'router-docs-code-splitting',
                import: () => import('./cf85e0f3.js'),
                name: 'Code splitting',
            },
        ],
    },
    {
        path: 'quick-start',
        component: 'router-docs-quick-start',
        import: () => import('./bb6424af.js'),
        name: 'Quick start',
    },
];
let ut,
    pt,
    mt,
    ft,
    gt,
    _t = (t) => t;
class wt extends Y {
    static get properties() {
        return { views: { type: Array } };
    }
    static get styles() {
        return Q(
            ut ||
                (ut = _t`:host{position:fixed;display:flex;flex-direction:column;left:0;top:0;z-index:10;background:#fff;height:100vh;width:15%;border-right:1px solid #eaeaea}h2{padding:0 1rem;font-size:1.8rem}.routes a{padding:.5rem;list-style:none;font-size:1.6rem;text-decoration:none;border-left:6px solid transparent;transition:.2s ease-in-out;cursor:pointer;color:inherit;margin:2px 0}.routes a:hover,.routes a[highlight]{border-left:6px solid #ff6d00}.routes{display:flex;flex-direction:column;height:80%}.routes ul{display:flex;flex-direction:column;margin:0 0 .5rem 0}.social-icons{font-size:1.2rem;padding:1rem;display:flex;flex-direction:column;text-align:right}.social-icons a{color:inherit;text-decoration:none;margin:5px 0}`)
        );
    }
    constructor() {
        super(), (this.views = []);
    }
    firstUpdated() {
        const t = new ct({ routes: dt });
        (this.views = dt), t.init();
    }
    shouldHighlightRow(t) {
        return t === window.location.pathname;
    }
    refreshList(t) {
        this.shadowRoot.querySelector('[highlight]').removeAttribute('highlight'),
            t.target.setAttribute('highlight', '');
    }
    render() {
        return L(
            pt ||
                (pt = _t` <h2>Simplr Router Docs</h2> <div class="routes"> ${0} </div> <div class="social-icons"> <a target="_blank" href="https://github.com/Simplr/simplr-router" rel="noreferrer">Github &#10148;</a> <a target="_blank" href="https://www.npmjs.com/package/@simplr-wc/router" rel="noreferrer">NPM &#10148;</a> <a target="_blank" href="https://twitter.com/matsuuu_" rel="noreferrer">Author &#10148;</a> </div> `),
            this.views.map((t) =>
                L(
                    mt || (mt = _t`<a ?highlight="${0}" href="${0}" @click="${0}">${0}</a> ${0}`),
                    this.shouldHighlightRow(t.path),
                    t.path,
                    this.refreshList,
                    t.name,
                    t.routes
                        ? L(
                              ft || (ft = _t` <ul> ${0} </ul>`),
                              t.routes.map((t) =>
                                  L(
                                      gt ||
                                          (gt = _t`<a ?highlight="${0}" href="${0}" @click="${0}">${0}</a>`),
                                      this.shouldHighlightRow(t.path),
                                      t.path,
                                      this.refreshList,
                                      t.name
                                  )
                              )
                          )
                        : ''
                )
            )
        );
    }
}
customElements.get('router-docs-navigation-drawer') ||
    customElements.define('router-docs-navigation-drawer', wt);
export { Y as L, Q as c, L as h };
