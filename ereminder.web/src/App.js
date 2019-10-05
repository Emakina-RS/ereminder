import React from "react";
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
import NewReminder from "./pages/NewReminder";
import Notifications from "./pages/Notifications";
import Register from "./pages/Register";
import Reminders from "./pages/Reminders";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="App-content">
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/new-reminder" component={NewReminder} />
            <Route path="/reminders" component={Reminders} />
            <Route path="/notifications" component={Notifications} />
            <Route path="/calendar" component={Calendar} />
            <Redirect to="/register" />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
