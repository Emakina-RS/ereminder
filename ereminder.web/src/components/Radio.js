import React from "react";
import "./Radio.css";

const Radio = ({text, name, handleChange, checked}) => {
  return (
    <div className="Radio">
      <label className="radio-lable">
        <input
          type="radio"
          className="radio"
          id={text}
          name={name}
          checked={checked}
          onChange={handleChange}
        />
        <span>{text}</span>
      </label>
    </div>
  );
};

export default Radio;
