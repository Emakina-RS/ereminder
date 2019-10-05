import React, { useState } from "react";
import "./Radio.css";

const Radio = () => {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <div
      className="Radio"
      style={isSelected ? { backgroundColor: "#bc1e2d" } : {}}
      onClick={() => setIsSelected(!isSelected)}
    />
  );
};

export default Radio;
