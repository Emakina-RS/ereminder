import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import useInput from "../hooks/useInput";
import { forgotPassword, closeModal } from "../actions"
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const email = useInput("email", "Unesite Vašu e-mail adresu");
  let {showModal, isSubmitting} = useSelector(state => state.forgotPassword);
  const dispatch = useDispatch();

  const hideModal = () => {
    dispatch(closeModal());
  };

  return (
    <div className="ForgotPassword">
      <div className="ForgotPassword-content">
        <h1>Zaboravili ste šifru</h1>
        <form
          onSubmit={event => {
            event.preventDefault();
            dispatch(forgotPassword(email.value));
          }}
        >
          <Input type="email" {...email} />
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
