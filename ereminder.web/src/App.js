import React from "react";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Calendar from "./pages/Calendar";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Notifications from "./pages/Notifications";
import NotificationsDates from "./pages/NotificationsDates";
import NotificationsType from "./pages/NotificationsType";
import Register from "./pages/Register";

const App = () => {
  const token = useSelector(state => state.token);
  const isLoggedIn = token !== "";
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="App-content">
          {isLoggedIn ? (
            <Switch>
              <Route path="/calendar" component={Calendar} />
              <Route path="/notifications" component={Notifications} />
              <Route
                path="/notifications-date"
                component={NotificationsDates}
              />
              <Route path="/notifications-type" component={NotificationsType} />
              <Redirect to="/calendar" />
            </Switch>
          ) : (
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
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
