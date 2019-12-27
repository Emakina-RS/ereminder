import { useState } from "react";
import { useDispatch, useSelector   } from "react-redux";
import { passwordInputField } from "../actions"

const useInput = (name, placeholder, validation) => {
  const [inputField, setInputField] = useState({
    validation,
    valid: false,
    errorMsg: "",
    value: ""
  });
  const data = useSelector(state => state.register);
  const dispatch = useDispatch();
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

    if (rules.required && value.trim() === "" && !rules.checkPair) {
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

    if (rules.checkPair && value.trim() > 0) {
      if(data.passwordFields["password"] !== data.passwordFields["confirm-password"]) {
        return {
          isValid: false,
          errorMsg: "Šifre nisu iste!"
        };
      }
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
    var name = event.target.name;
    dispatch(passwordInputField({[name]:event.target.value}))

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
