import React from "react";
import "./Radio.css";

const Radio = props => {
  return (
    <div className="Radio">
      <label className="radio-lable">
        <input
          type="radio"
          className="radio"
          id={props.text}
          name={props.name}
        />
        <span>{props.text}</span>
      </label>
    </div>
  );
};

export default Radio;
