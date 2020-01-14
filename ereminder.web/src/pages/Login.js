import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { logIn, verifyRecaptcha } from "../actions";
import Button from "../components/Button";
import Input from "../components/Input";
import InvalidLoginMessage from "../components/InvalidLoginMessage";
import useInput from "../hooks/useInput";
import Recaptcha from 'react-google-invisible-recaptcha';
import "./Login.css";

const mapStateToProps = state => ({
  isSubmitting: state.login.isSubmitting,
  shouldRedirect: state.token !== ""
});

const mapDispatchToProps = {
  logIn
};

const Login = ({
  shouldRedirect,
  logIn
}) => {
  let inputFields = [];
  let recaptcha = {};
  const [recaptchaMessage, setRecaptchaMessage] = useState('');
  const email = inputFields[0] = useInput("email", "Unesite Vašu e-mail adresu", { required: true, email: true });
  const password = inputFields[1] = useInput("password", "Unesite šifru", { required: true });

  if (shouldRedirect) {
    console.log("redirecting...");
    return <Redirect to="/" />;
  }

  const checkFormValidation = () => {
    let isFormValid = true;
    for (let input of inputFields) {
      isFormValid = input.valid && isFormValid;
    }

    return isFormValid;
  };

  let submitFormHandler = (event) => {
    event.preventDefault();

    if (checkFormValidation()) {
      let parentObj = {
        recaptchaInstance: recaptcha,
        email: email.value,
        password: password.value
      };

      recaptcha.execute()
        .then((token) => {
          onTokenResolved(token, parentObj);
        });
    }
  };

  const onTokenResolved = async (token, parentObj) => {
    let response = await verifyRecaptcha(token);
    if (response.success) {
      logIn(parentObj.email, parentObj.password);
    } else {
      parentObj.recaptchaInstance.reset();
    }

    setRecaptchaMessage(response.message);
  };

  return (
    <div className="Login">
      <form
        onSubmit={submitFormHandler}
        className="Login-content"
        autoComplete="off"
      >
        <h1>Uloguj se</h1>
        <Input type="email" {...email} />
        <Input type="password" {...password} />
        <InvalidLoginMessage></InvalidLoginMessage>
        <Button active={checkFormValidation()}>Uloguj se</Button>
        {recaptchaMessage}
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
        <Recaptcha
          ref={ref => recaptcha = ref}
          sitekey={process.env.REACT_APP_SITE_KEY}
        />
      </form>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
