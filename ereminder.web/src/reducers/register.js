const initialState = {
  isFetching: false,
  passwordFields: {}
};

const register = (state = initialState, action) => {
  switch (action.type) {
    case "REGISTER":
      return {
        isFetching: true
      };
    case "REGISTER_SUCCESSFUL":
    case "REGISTER_FAILED":
      return {
        isFetching: false
      };
    case "PASSWORD_INPUT":
      return {
        ...state,
        passwordFields: {...state.passwordFields,...action.data,}
      };
    default:
      return state;
  }
};

export default register;
