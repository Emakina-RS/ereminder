import React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import "./App.css";
import Input from "./components/Input";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reminders from "./pages/Reminders";

function App() {
  return (
    <Router className="" >
      <Navbar />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/reminders" component={Reminders} />
    </Router>
  );
}

export default App;
