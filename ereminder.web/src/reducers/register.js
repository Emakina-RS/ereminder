const initialState = {
  isFetching: false
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
    default:
      return state;
  }
};

export default register;
