import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import "./Login.css";

const Login = ({ history }) => (
  <div className="Login">
    <div className="Login-content">
      <h1>Uloguj se</h1>
      <Input placeholder="Unesite Vašu e-mail adresu" />
      <Input placeholder="Unesite šifru" />
      <Button onClick={() => history.push("/calendar")}>Uloguj se</Button>
      <div className="Login-allready">
        <h2>
          Nemate nalog? Registruj se{" "}
          <Link className="Login-span-link" to="/register">
            ovde
          </Link>
        </h2>
        <h2>
          <Link className="Login-span-link" to="/forgot-password">
            Zaboravili ste Vašu šifru?
          </Link>
        </h2>
      </div>
    </div>
  </div>
);

export default Login;
