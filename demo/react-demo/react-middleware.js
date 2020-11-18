import React from "react";
import ReactDOM from "react-dom";

class ReactMiddlewareInstance {
  addViewToContainerOverride(container, viewObject) {
    ReactDOM.render(viewObject, container);
  }

  async createComponentOverride(view) {
    if (view.import) {
      await view.import();
    }

    const component = React.createElement(view.component, view.params, null);
    return component;
  }
}

export default function ReactMiddleware() {
  return new ReactMiddlewareInstance();
}
