import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { routerMiddleware } from "react-router-redux";
import { AppContainer } from "react-hot-loader";
import createHistory from "history/createBrowserHistory";

import buildStore from "ui/store";
import { ReduxAsyncConnect } from "redux-connect";

const NODE_ENV = process.env.NODE_ENV;
const history = createHistory();
const routemw = routerMiddleware(history);

export default function buildClient() {
  let middlewares = [routemw];

  if (NODE_ENV === "development") {
    middlewares.push(require("redux-logger").createLogger());
  }

  const data = window.__DATA || {};
  const store = buildStore(data, middlewares);

  return function(routes) {
    ReactDOM.hydrate(
      <Provider store={store}>
        <BrowserRouter>
          <AppContainer>
            <ReduxAsyncConnect routes={routes} helpers={{}} />
          </AppContainer>
        </BrowserRouter>
      </Provider>,
      document.getElementById("root")
    );
  };
}
