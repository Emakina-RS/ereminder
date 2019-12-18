import throttle from "lodash/throttle";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import App from "./App";
import "./index.css";
import calendar from "./reducers/calendar";
import configuration from "./reducers/configuration";
import forgotPassword from "./reducers/forgotPassword";
import login from "./reducers/login";
import notificationDashboard from "./reducers/notificationDashboard";
import register from "./reducers/register";
import registerConfirmation from "./reducers/registerConfirmation";
import settings from "./reducers/settings";
import token from "./reducers/token";
import auth from "./reducers/auth";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    const serializedAuth = localStorage.getItem("auth");
    return [JSON.parse(serializedState), JSON.parse(serializedAuth)];
  } catch (exception) {
    // ignore read errors
  }
};

const saveState = (state, authState) => {
  try {
    const serializedState = JSON.stringify(state);
    if (authState) {
      const arrivedTokenTime = new Date().getTime() / 1000;
      authState.auth.arrivedTokenTime = arrivedTokenTime;
    }

    const serializedAuth = JSON.stringify(authState);
    localStorage.setItem("state", serializedState);
    localStorage.setItem("auth", serializedAuth);
  } catch (exception) {
    // ignore write errors
  }
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers({
    configuration,
    login,
    register,
    settings,
    token,
    calendar,
    forgotPassword,
    registerConfirmation,
    notificationDashboard,
    auth
  }),
  loadState(), composeEnhancers(
    applyMiddleware(thunk))
);

store.subscribe(
  throttle(() => {
    const state = store.getState();
    saveState({ token: state.token }, { auth: state.auth });
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
