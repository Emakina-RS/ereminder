import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import "./Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmpassword] = useState("");

  return (
    <div className="Register">
      <div className="Register-content">
        <h1>Registruj se</h1>
        <form
          onSubmit={async event => {
            event.preventDefault();
            const response = await fetch("/register", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                email,
                password,
                confirmpassword: confirmPassword
              })
            });
            console.log(response);
          }}
        >
          <Input
            name="email"
            onChange={event => setEmail(event.target.value)}
            placeholder="Unesite Vašu e-mail adresu"
            type="email"
            value={email}
          />
          <Input
            name="password"
            onChange={event => setPassword(event.target.value)}
            placeholder="Unesite šifru"
            type="password"
            value={password}
          />
          <Input
            name="confirm-password"
            onChange={event => setConfirmpassword(event.target.value)}
            placeholder="Ponovite šifru"
            type="password"
            value={confirmPassword}
          />
          <Button>Registruj se</Button>
          <div className="Register-allready">
            <h2>
              Već imate nalog? Uloguj se{" "}
              <Link className="Register-span-link" to="/login">
                ovde
              </Link>
            </h2>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
