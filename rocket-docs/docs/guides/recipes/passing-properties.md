# Recipes >> Passing properties

Sometimes we might want to "inject" some properties to our views while we render them. This is where the `properties` property comes to play.

```javascript
const localeOptions = {
    locale: "fi_FI"
}

const routes = [
    { path: "", component: "simplr-router-demo" },
    {
        path: "user",
        component: "user-view",
        properties: {
            localeOptions: localeOptions
        }
    },
];

const router = new SimplrRouter({ routes });
router.init();
```

The property is then accessible from the view itself

```javascript
// Inside user-view

console.log(this.localeOptions);
// { locale: "fi_FI" }
```

This can be useful for unit testing your application as you can provide separate implementations of properties into
your views depending on the environment.
