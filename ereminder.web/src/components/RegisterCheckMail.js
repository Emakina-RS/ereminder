import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import "./RegisterCheckMail.css";

const RegisterCheckMail = () => {
    const data = useSelector(state => state.register.confirm);

    if (data) {
        return (
            <h2 className="registerHeader">{data}</h2>
        );
    } 
    return (null);
};

export default RegisterCheckMail;