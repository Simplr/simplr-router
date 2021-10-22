# API >> Router Options

Type name: SimplrRouterOptions

| Name            | Type        | Description                                                              |
| --------------- | ----------- | ------------------------------------------------------------------------ |
| routes          | SimplrRoute | Routes provided for the Simplr Router.                                   |
| rootPath        | string      | Root path of the router. If the root is not the origin of the host.      |
| transitionSpeed | number      | Transition speed of view transitions in milliseconds.                    |
| notFoundAction  | Function    | Action triggered when a view is not found.                               |
| forbiddenAction | Function    | Action triggered when access to a view is forbidden by a guard function. |
| debugging       | boolean     | Enable debugging.                                                        |
