import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import LoggedInRoot from "./components/LoggedInRoot";
import Navbar from "./components/Navbar";
import Calendar from "./pages/Calendar";
import Configuration from "./pages/Configuration";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Notification from "./pages/Notification";
import NotificationDashboard from "./pages/NotificationDashboard";
import Register from "./pages/Register";
import ConfirmRegistration from "./pages/ConfirmRegistration";

const App = () => {
  const token = useSelector(state => state.token);
  const isLoggedIn = token !== "";
  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} />
        <div className="App-content">
          {isLoggedIn ? (
            <Switch>
              <Route exact path="/" component={LoggedInRoot} />
              <Route path="/login" component={Login} />
              <Route path="/calendar" component={Calendar} />
              <Route path="/notifications-dashboard" component={NotificationDashboard} />
              <Route
                path="/configuration"
                component={Configuration}
              />
              <Route path="/notification" component={Notification} />
              <Redirect to="/" />
            </Switch>
          ) : (
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/confirmregistration" component={ConfirmRegistration} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Redirect to="/login" />
            </Switch>
          )}
        </div>
      </div>
    </Router>
  );
};

export default App;
