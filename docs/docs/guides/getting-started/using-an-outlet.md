# Getting started >> Using an outlet || 30

Simplr Router creates a container for your views that fills the whole screen by default.

In some cases you might want to only have a part of the page change instead of the whole content.

In these cases an outlet can be used to determine the area in which content changes.

Determining an outlet is done by creating a `simplr-router-outlet` somewhere on your web page.

## Using an outlet

```javascript
render() {}
  return html`<main>
    <div class="logo"><img alt="open-wc logo" src=${logo} /></div>
    <simplr-router-outlet></simplr-router-outlet>
  </main>
  `;
}
```

After the outlet has been added, Simplr Router will look for a outlet when navigating. If one is found, it is used instead 
of the default behavior.
