import { useState } from "react";

const useCheckbox = (value) => {
  const [isChecked, setIsChecked] = useState(value);

  const changehandler = () => {
    setIsChecked(!isChecked);
  };

  return {
    onChange: changehandler,
    value: isChecked
  };
};

export default useCheckbox;
