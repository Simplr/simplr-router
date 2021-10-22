# Recipes >> Programmatic navigation

You might run into a situation while writing your web page, where you want to programmatically
navigate to a path. For these situations you can use the built in function `changeView`.

`changeView` can be called with either the path of the page, or the name of the page.
The function can also be provided with a page hash if needed.

```javascript
import { changeView } from "@simplr-wc/router";

// With path
changeView({ path: "/user/123" });

// With name
changeView({ name: "home" });

// With hash
changeView({ path: "/docs/foo", hash: "#important-info" });
```
