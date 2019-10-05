import React, { useState } from "react";
import "./Radio.css";

const Radio = props => {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <div className="Radio-container">
      <div
        className="Radio"
        style={isSelected ? { backgroundColor: "#bc1e2d" } : {}}
        onClick={() => setIsSelected(!isSelected)}
      >
        {" "}
      </div>
      <p>{props.text}</p>
    </div>
  );
};

export default Radio;
