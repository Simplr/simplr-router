import SimplrRouterMiddleware from "../../lib/modules/middleware.js";

class ReactMiddlewareInstance extends SimplrRouterMiddleware {
  addViewToContainerOverride(container, viewObject) {
    // TODO: With React we would do something like:
    /*
     * ReactDOM.render(
     *   React.createElement(MyView, {params: foo}, null),
     *   container
     * );
     * */
    container.appendChild(viewObject);
  }
}

export default function ReactMiddleware() {
  return new ReactMiddlewareInstance();
}
