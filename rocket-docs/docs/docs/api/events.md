# API >> Events

Events are dispatched into the window context. Most of them ship payloads containing useful information about the event.

Type name: SimplrRouterOptions

| Name                           | Description                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------ |
| simplr-router-transition-start | Simplr router has started transitioning to another view                        |
| simplr-router-transition-end   | Simplr router has finished transitioning to another view                       |
| simplr-router-initialized      | Simplr router has initialized. (After init() call)                             |
| simplr-router-navigated        | Simplr router has navigated to a new view, and updated the history accordingly |
