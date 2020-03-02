import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { closeModal, forgotPassword } from "../actions";
import Button from "../components/Button";
import Input from "../components/Input";
import AutofocusedInput from "../components/AutofocusedInput";
import Modal from "../components/Modal";
import useInput from "../hooks/useInput";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  let inputFields = [];
  const email = inputFields[0] = useInput("email", "Unesite Vašu e-mail adresu", { required: true, email: true });

  let {showModal, isSubmitting} = useSelector(state => state.forgotPassword);
  const dispatch = useDispatch();

  const hideModal = () => {
    dispatch(closeModal());
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();
    let isFormValid = true;
    for (let input of inputFields) {
      isFormValid = input.valid && isFormValid;
    }
    if (isFormValid) {
      dispatch(forgotPassword(email.value));
    }
  };

  return (
    <div className="ForgotPassword">
      <div className="ForgotPassword-content">
        <h1>Zaboravili ste šifru</h1>
        <form onSubmit={formSubmitHandler} autoComplete="off">
          <AutofocusedInput type="email" {...email} />
          <Button disabled={isSubmitting}>Restartuj šifru</Button>
          <div className="ForgotPassword-allready">
            <h2>
              <Link className="ForgotPassword-span-link" to="/login">
                Vrati se na stranu za logovanje
              </Link>
            </h2>
          </div>
        </form>
      </div>
      <Modal isShowing={showModal} hide={hideModal} content={modalContent()} />
    </div>
  );
};

const modalContent = () => {
  return (
    <div className="ForgotPassword-modal-text">
      <div>Zahtev za resetovanje šifre je poslat.</div>
      <div>Proverite Vaš email.</div>
    </div>
  );
};

export default ForgotPassword;
