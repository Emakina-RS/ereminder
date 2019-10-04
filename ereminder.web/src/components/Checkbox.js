import React, { useState } from "react";
import "./Checkbox.css";

const Checkbox = () => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div
      className="Checkbox"
      style={isChecked ? { backgroundColor: "#bc1e2d" } : {}}
      onClick={() => setIsChecked(!isChecked)}
    />
  );
};

export default Checkbox;
