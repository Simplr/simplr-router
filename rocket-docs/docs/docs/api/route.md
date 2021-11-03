# API >> Route

Type name: SimplrRoute

| Name          | Type                            | Description                                                                         |
| ------------- | ------------------------------- | ----------------------------------------------------------------------------------- |
| path          | string                          | The URL path for the route                                                          |
| component     | string                          | The view component name for the route                                               |
| name          | string                          | Name of the view route                                                              |
| import        | Function                        | An import function for lazy loading. e.g. () => import("./my-view.js")              |
| guard         | Function                        | A guard function to check view access                                               |
| routes        | SimplrRoute[]                   | An array of subroutes that inherit paths from the parent route                      |
| slots         | [x: string]: string \| Function | An array of slots to append to the view component                                   |
| pattern       | [x: string]: string \|          | RegExp pattern to match dynamic route keys                                          |
| redirect      | string \| { name: string }      | Path to redirect to                                                                 |
| preventUnload | boolean                         | If the router should intercept navigation from this page with a confirmation dialog |
