import React from "react";
import "./Checkbox.css";

const Checkbox = ({text, name, value, onChange, isDisabled}) => {
  return (
    <div className="Checkbox">
      <label className="checkbox-lable">
        <input
          type="checkbox"
          className="checkbox"
          id={text}
          name={name}
          checked={value}
		  onChange={onChange}
		  disabled={isDisabled}
        />
        <span className="checkbox-text">{text}</span>
      </label>
    </div>
  );
};

export default Checkbox;
