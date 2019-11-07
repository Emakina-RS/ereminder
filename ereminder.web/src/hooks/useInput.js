import { useState } from "react";

const useInput = (name, placeholder, validation) => {
  const [inputField, setInputField] = useState({
    validation,
    valid: false,
    errorMsg: "",
    value: ""
  });

  /**
   * Checks existence and email validity
   * 
   * @param {String} value Value to be validated
   * @param {Object} rules Validation rules (required or email validation)
   * @returns {Object} Validation result and error message
  */
  const checkValidity = (value, rules) => {
    if (!rules) {
      return { isValid: true };
    }

    if (rules.required && value.trim() === "") {
      return {
        isValid: false,
        errorMsg: "Ovo polje je obavezno"
      };
    }

    const emailRegex = new RegExp('^[-A-zΑ-ω0-9.%+-]+@[-A-zΑ-ω0-9.-]+\.[-A-zΑ-ω0-9]{2,6}$');
    if (rules.email && !emailRegex.test(value.trim())) {
      return {
        isValid: false,
        errorMsg: "Nevalidna email adresa"
      };
    }

    return { isValid: true };
  };

  const inputValidationHandler = (event) => {
    const validationRules = inputField.validation;
    const validationCheckObj = checkValidity(event.target.value, validationRules);
    
    const updatedInputField = {
      ...inputField,
      valid: validationCheckObj.isValid,
      errorMsg: validationCheckObj.errorMsg
    };

    setInputField(updatedInputField);
  };

  const inputChangedHandler = (event) => {
    const updatedInputField = {
      ...inputField,
      value: event.target.value
    };

    setInputField(updatedInputField);
  };

  return {
    name,
    onChange: inputChangedHandler,
    onBlur: inputValidationHandler,
    placeholder,
    value: inputField.value,
    valid: inputField.valid,
    errorMsg: inputField.errorMsg
  };
};

export default useInput;
