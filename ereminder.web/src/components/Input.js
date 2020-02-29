import React from "react";
import "./Input.css";

const Input = props => {
  let validationErrorMsg = null;
  let style = "Input";
  if (!props.valid && props.errorMsg) {
    validationErrorMsg = <div className="Input-validation-error">{props.errorMsg}</div>;
    style = "Input-invalid";
  }

  return (
    <div>
      {validationErrorMsg}
      <input
        className={style}
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        onKeyUp={props.onKeyUp}
        required
      />
    </div>
  );
};

export default Input;
