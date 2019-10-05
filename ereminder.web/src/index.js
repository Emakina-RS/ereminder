import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import App from "./App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

const initialState = {
  isFetching: false
};

const registerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "REGISTER":
      return {
        isFetching: true
      };
    case "REGISTER_SUCCESSFUL":
    case "REGISTER_FAILED":
      return {
        isFetching: false
      };
    default:
      return state;
  }
};

const store = createStore(registerReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <App className="full" />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default;
    ReactDOM.render(
      <Provider store={store}>
        <NextApp className="full" />
      </Provider>,
      document.getElementById("root")
    );
  });
}
