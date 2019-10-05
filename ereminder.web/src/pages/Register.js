import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import "./Register.css";

const Register = ({ history }) => (
  <div className="Register">
    <div className="Register-content">
      <h1>Registruj se</h1>
      <Input placeholder="Unesite Vašu e-mail adresu" />
      <Input placeholder="Unesite šifru" />
      <Input placeholder="Ponovite šifru" />
      <Button onClick={() => history.push("/new-reminder")}>
        Registruj se
      </Button>
      <div className="Register-allready">
        <h2>
          Već imate nalog? Uloguj se{" "}
          <Link className="Register-span-link" to="/login">
            ovde
          </Link>
        </h2>
      </div>
    </div>
  </div>
);

export default Register;
