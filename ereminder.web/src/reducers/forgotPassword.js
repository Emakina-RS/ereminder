const initialState = {
    isSubmitting: false,
    showModal: false
};

const forgotPassword = (state = initialState, action) => {
  switch (action.type) {
    case "FORGOT_PASSWORD":
       return {
          ...state,
          isSubmitting: true
       };
    case "FORGOT_PASSWORD_SUCCESS":
      return {
        ...state,
        showModal: true
      };
    case "FORGOT_PASSWORD_FAILURE":
    case "CLOSE_MODAL":
      return initialState;
    default:
      return state;
  }
};

export default forgotPassword;