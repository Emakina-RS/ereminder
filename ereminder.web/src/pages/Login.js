import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { logIn } from "../actions";
import Button from "../components/Button";
import Input from "../components/Input";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isSubmitting, shouldRedirect } = useSelector(state => state.login);
  const dispatch = useDispatch();
  if (shouldRedirect) {
    return <Redirect to="/calendar" />;
  }
  return (
    <div className="Login">
      <form
        onSubmit={event => {
          event.preventDefault();
          dispatch(logIn(email, password));
          setEmail("");
          setPassword("");
        }}
        className="Login-content"
      >
        <h1>Uloguj se</h1>
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
        <Button disabled={isSubmitting}>Uloguj se</Button>
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
      </form>
    </div>
  );
};

export default Login;
