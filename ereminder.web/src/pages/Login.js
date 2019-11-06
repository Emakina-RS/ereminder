import React from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { logIn } from "../actions";
import Button from "../components/Button";
import Input from "../components/Input";
import useInput from "../hooks/useInput";
import "./Login.css";

const mapStateToProps = state => ({
  isSubmitting: state.login.isSubmitting,
  shouldRedirect: state.token !== ""
});

const mapDispatchToProps = {
  logIn
};

const Login = ({
  isSubmitting,
  shouldRedirect,
  logIn
}) => {
  let inputFields = [];
  const email = inputFields[0] = useInput("email", "Unesite Vašu e-mail adresu", { required: true, email: true });
  const password = inputFields[1] = useInput("password", "Unesite šifru", { required: true });
  if (shouldRedirect) {
    console.log("redirecting...");
    return <Redirect to="/notifications-date" />;
  }

  const formSubmitHandler = (event) => {
    event.preventDefault();
    let isFormValid = true;
    for (let input of inputFields) {
      isFormValid = input.valid && isFormValid;
    }
    if (isFormValid) {
      logIn(email.value, password.value);
    }
  };

  return (
    <div className="Login">
      <form
        onSubmit={formSubmitHandler}
        className="Login-content"
      >
        <h1>Uloguj se</h1>
        <Input type="email" {...email} />
        <Input type="password" {...password} />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
