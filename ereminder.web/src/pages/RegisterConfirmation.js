import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerConfirmation } from "../actions";
import { useHistory } from "react-router-dom";
import Button from "../components/Button";
import Spinner from 'reactjs-simple-spinner';
import "./RegisterConfirmation.css";

const RegisterConfirmation = () => {
  let {loading, message} = useSelector(state => state.registerConfirmation);
  const dispatch = useDispatch();
  const history = useHistory();
  
  let params = new URLSearchParams(window.location.search);
  let token = params.get('q');

  useEffect(() => {
    dispatch(registerConfirmation(token));
  }, [dispatch]);


  let redirectHome = function () {
    history.push("/login");
  };
  
  const renderContent = (loading, message) => {
    
    if (loading) {
      return (
        <Spinner size={66} lineSize={7} speed={2}  message={message} lineFgColor="#bd1e2c" spacing={20} fontSize={30} />
      );
    }

    return(
      <h1>{message}</h1>
    );
  };

  return (
    <div className="RegisterConfirmation">
      <div className="RegisterConfirmation-content">

        <div className= "RegisterConfirmation-center">
          {renderContent(loading, message)}
        </div>
        <div className= "RegisterConfirmation-bottom">
          <Button disabled={loading} onClick={redirectHome}>Nazad na početnu stranicu</Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterConfirmation;
