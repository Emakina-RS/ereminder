import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { register } from "../actions";
import Button from "../components/Button";
import Input from "../components/Input";
import useInput from "../hooks/useInput";
import "./Register.css";

const Register = () => {
  const email = useInput("email", "Unesite Vašu e-mail adresu");
  const password = useInput("password", "Unesite šifru");
  const confirmPassword = useInput("confirm-password", "Ponovite šifru");
  const isFetching = useSelector(state => state.register.isFetching);
  const dispatch = useDispatch();

  return (
    <div className="Register">
      <div className="Register-content">
        <h1>Registruj se</h1>
        <form
          onSubmit={event => {
            event.preventDefault();
            dispatch(
              register(email.value, password.value, confirmPassword.value)
            );
          }}
        >
          <Input type="email" {...email} />
          <Input type="password" {...password} />
          <Input type="password" {...confirmPassword} />
          <Button disabled={isFetching}>Registruj se</Button>
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
