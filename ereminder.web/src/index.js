import throttle from "lodash/throttle";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import App from "./App";
import "./index.css";
import calendar from "./reducers/calendar";
import configuration from "./reducers/configuration";
import login from "./reducers/login";
import register from "./reducers/register";
import settings from "./reducers/settings";
import token from "./reducers/token";
import forgotPassword from "./reducers/forgotPassword";
import registerConfirmation from "./reducers/registerConfirmation";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    return serializedState !== null ? JSON.parse(serializedState) : undefined;
  } catch (exception) {
    // ignore read errors
  }
};

const saveState = state => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (exception) {
    // ignore write errors
  }
};

const store = createStore(
  combineReducers({
    configuration,
    login,
    register,
    settings,
    token,
    calendar,
    forgotPassword,
    registerConfirmation
  }),
  loadState(),
  applyMiddleware(thunk)
);

store.subscribe(
  throttle(() => {
    const state = store.getState();
    saveState({ token: state.token });
  }, 1000)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default;
    ReactDOM.render(
      <Provider store={store}>
        <NextApp />
      </Provider>,
      document.getElementById("root")
    );
  });
}
