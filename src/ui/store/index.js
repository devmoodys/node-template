import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";

import rootReducer from "ui/store/reducers";

const defaultMiddlewares = [thunkMiddleware];

export default function buildStore(
  initialState = {},
  additionalMiddleware = []
) {
  const middlewares = defaultMiddlewares.concat(additionalMiddleware);
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middlewares)
  );
}
