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
  const email = useInput("email", "Unesite Vašu e-mail adresu");
  const password = useInput("password", "Unesite šifru");
  if (shouldRedirect) {
    console.log("redirecting...");
    return <Redirect to="/whatever" />;
  }
  return (
    <div className="Login">
      <form
        onSubmit={event => {
          event.preventDefault();
          logIn(email.value, password.value);
        }}
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
