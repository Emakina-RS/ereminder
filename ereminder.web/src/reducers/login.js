const initialState = {};

const login = (state = initialState, action) => {
  switch (action.type) {
    case "LOG_IN":
      return { isSubmitting: true };
    case "LOG_IN_FAILED":
    case "LOG_OUT":
      return initialState;
    case "LOG_IN_SUCCESSFUL":
      return { shouldRedirect: true };
    default:
      return state;
  }
};

export default login;
