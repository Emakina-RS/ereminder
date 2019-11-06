import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { register } from "../actions";
import Button from "../components/Button";
import Input from "../components/Input";
import useInput from "../hooks/useInput";
import "./Register.css";

const Register = () => {
  let inputFields = [];
  const email = inputFields[0] = useInput("email", "Unesite Vašu e-mail adresu", { required: true, email: true });
  const password = inputFields[1] = useInput("password", "Unesite šifru", { required: true });
  const confirmPassword = inputFields[2] = useInput("confirm-password", "Ponovite šifru", { required: true });
  const isFetching = useSelector(state => state.register.isFetching);
  const dispatch = useDispatch();


  const formSubmitHandler = (event) => {
    event.preventDefault();
    let isFormValid = true;
    for (let input of inputFields) {
      isFormValid = input.valid && isFormValid;
    }
    if (isFormValid) {
      dispatch(
        register(email.value, password.value, confirmPassword.value)
      );
    }
  };

  return (
    <div className="Register">
      <div className="Register-content">
        <h1>Registruj se</h1>
        <form onSubmit={formSubmitHandler}>
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
