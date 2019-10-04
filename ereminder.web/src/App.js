import React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import "./App.css";
import Input from "./components/Input";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Navbar />
      <Input placeholder="Unesite vašu e-mail adresu" />
      <Input placeholder="Unesite vašu šifru" />
      <Input placeholder="Ponovite vašu šifru" />
      <Link to="/register">Registruj se</Link>
      <span>
        Već imate nalog? Uloguj se <Link to="/login">ovde</Link>
      </span>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Router>
  );
}

export default App;
