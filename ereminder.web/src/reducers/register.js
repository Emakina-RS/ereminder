const initialState = {
  isFetching: false,
  passwordFields: {},
  confirm: '',
  errorMsg: ''
};

const register = (state = initialState, action) => {
  switch (action.type) {
    case "REGISTER":
      return {
        ...state,
        isFetching: true
      };
    case "REGISTER_SUCCESSFUL":
      return {
        ...state,
        isFetching: false,
        confirm: action.data,
        errorMsg: ''
      };
    case "REGISTER_FAILED":
      return {
        ...state,
        isFetching: false,
        errorMsg: action.data
      };
    case "LOAD_REGISTER":
      return {
        ...state,
        confirm: '',
        errorMsg: ''
      };
    case "PASSWORD_INPUT":
      return {
        ...state,
        passwordFields: { ...state.passwordFields, ...action.data }
      };
    default:
      return state;
  }
};

export default register;
