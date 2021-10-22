# Customizing >> Styling transitions

You can create transition animations for your views by modifying the css of the wrapper Simplr Router creates.

To enable transitions, a `transitionSpeed` property needs to be set in the config.

```javascript
const routerOptions = {
    routes: [
        {
            name: "Home",
            path: "",
            component: "router-demo",
        },
        {
            name: "Example",
            path: "example",
            component: "router-example",
        }
    ]
    transitionSpeed: 400 // in ms
}

const router = new SimplrRouter(routerOptions);
router.init();
```

Now all that is needed is to modify the css of the `simplr-router-container` -element.

### Example transitions

#### Fade in out

```css
simplr-router-container[entering-view],
simplr-router-container[leaving-view] {
  opacity: 0;
}
```

#### Slide in out

```css
simplr-router-container[entering-view] {
  transform: translateX(-100%);
}

simplr-router-container[leaving-view] {
  transform: translateX(100%);
}
```

#### Zoom

```css
simplr-router-container[entering-view] {
  transform: scale(0);
}

simplr-router-container[leaving-view] {
  z-index: -1;
}
```
