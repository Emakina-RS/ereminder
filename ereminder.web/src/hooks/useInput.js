import { useState } from "react";

const useInput = (name, placeholder) => {
  const [value, setValue] = useState("");
  return {
    name,
    onChange: event => setValue(event.target.value),
    placeholder,
    value
  };
};

export default useInput;
