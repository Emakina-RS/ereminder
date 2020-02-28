import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../actions";
import Button from "../components/Button";
import Input from "../components/Input";
import useInput from "../hooks/useInput";
import "./RestartPassword.css";

const RestartPassword = () => {
  let inputFields = [];
  const password = inputFields[0] = useInput("password", "Unesite šifru", { required: true });
  const confirmPassword = inputFields[1] = useInput("confirm-password", "Ponovite šifru", { required: true, checkPair: true });
  const token = new URLSearchParams(window.location.search).get('q');

  const dispatch = useDispatch();
  const isFetching = useSelector(state => state.register.isFetching);

  const formSubmitHandler = (event) => {
    event.preventDefault();

    let isFormValid = true;
    for (let input of inputFields) {
      isFormValid = input.valid && isFormValid;
    }

    if (isFormValid) {
      dispatch(
        resetPassword(token, password.value, confirmPassword.value)
      );
    }
  };

  return (
    <div className="RestartPassword">
      <div className="RestartPassword-content">
        <h1>Unesite novu šifru</h1>
        <form onSubmit={formSubmitHandler} autoComplete="off">
          <Input type="password" {...password} />
          <Input type="password" {...confirmPassword} />
          <Button disabled={isFetching}>Sačuvaj</Button>
        </form>
      </div>
    </div>
  );
};

export default RestartPassword;
