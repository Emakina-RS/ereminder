import React from "react";
import "./Checkbox.css";

const Checkbox = props => {
  return (
    <div className="Checkbox">
      <label className="checkbox-lable">
        <input
          type="checkbox"
          className="checkbox"
          id={props.text}
          name={props.name}
        />
        <span className="checkbox-text">{props.text}</span>
      </label>
    </div>
  );
};

export default Checkbox;
