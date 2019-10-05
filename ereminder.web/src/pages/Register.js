import React from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import "./Register.css";

const Register = () => (
  <div className="Register">
    <h1>Register</h1>
    <Input placeholder="Unesite vašu e-mail adresu" />
    <Input placeholder="Unesite vašu šifru" />
    <Input placeholder="Ponovite vašu šifru" />
    <div className="Register-center">
      <Link to="/new-reminder" className="button">
        Registruj se
      </Link>
      <span>
        Već imate nalog? Uloguj se{" "}
        <Link className="span-link" to="/login">
          ovde
        </Link>
      </span>
    </div>
  </div>
);

export default Register;
