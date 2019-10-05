import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import "./Register.css";

const register = (email, password, confirmPassword) => dispatch => {
  dispatch({
    type: "REGISTER"
  });
  fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password,
      confirmpassword: confirmPassword
    })
  })
    .then(() =>
      dispatch({
        type: "REGISTER_SUCCESSFUL"
      })
    )
    .catch(() =>
      dispatch({
        type: "REGISTER_FAILED"
      })
    );
};

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmpassword] = useState("");
  const isFetching = useSelector(state => state.isFetching);
  const dispatch = useDispatch();

  return (
    <div className="Register">
      <div className="Register-content">
        <h1>Registruj se</h1>
        <form
          onSubmit={event => {
            event.preventDefault();
            dispatch(register(email, password, confirmPassword));
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
          <Button>
            {isFetching ? "Registracija u toku..." : "Registruj se"}
          </Button>
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
