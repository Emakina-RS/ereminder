import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import "./ForgotPassword.css";

const ForgotPassword = ({ history }) => (
  <div className="ForgotPassword">
    <div className="ForgotPassword-content">
      <h1>Zaboravili ste šifru</h1>
      <Input placeholder="Unesite Vašu e-mail adresu" />
      <Button onClick={() => history.push("/calendar")}>Restartuj šifru</Button>
      <div className="ForgotPassword-allready">
        <h2>
          <Link className="ForgotPassword-span-link" to="/login">
            Vrati se na stranu za logovanje
          </Link>
        </h2>
      </div>
    </div>
  </div>
);

export default ForgotPassword;
