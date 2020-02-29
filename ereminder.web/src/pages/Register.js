import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { register, loadRegister } from "../actions";
import Button from "../components/Button";
import Input from "../components/Input";
import useInput from "../hooks/useInput";
import "./Register.css";

const Register = () => {
  let inputFields = [];
  const email = inputFields[0] = useInput("email", "Unesite Vašu e-mail adresu", { required: true, email: true });
  const password = inputFields[1] = useInput("password", "Unesite šifru", { required: true });
  const confirmPassword = inputFields[2] = useInput("confirm-password", "Ponovite šifru", { required: true, checkPair: true});
  const { isFetching, confirm, errorMsg } = useSelector(state => state.register);
  const dispatch = useDispatch();

  useEffect(() => {
    if (confirm) {
      return () => {
        dispatch(loadRegister());
      }
    }
  });

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

  const renderRegistrationBlock = (isFetching, confirm) => {
    if (confirm) {
      return (
        <h2 className="Register-Msg">{confirm}</h2>
      );
    }

    return(
      <form onSubmit={formSubmitHandler} autoComplete="off" >
        <Input type="email" {...email} />
        <Input type="password" {...password} />
        <Input type="password" {...confirmPassword} />
        <Button disabled={isFetching}>Registruj se</Button>
      </form>
    );
  };

  const renderRegistrationError = (errorMsg) => {
    if (errorMsg) {
      return (
        <h2 className="Register-Msg">{errorMsg}</h2>
      );
    }

    return null;
  }

  return (
    <div className="Register">
      <div className="Register-content">
        <h1>Registruj se</h1>
        { renderRegistrationBlock(isFetching, confirm) }
        { renderRegistrationError(errorMsg)}
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
};

export default Register;
