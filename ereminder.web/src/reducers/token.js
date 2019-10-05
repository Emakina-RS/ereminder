const initialState = "";

const token = (state = initialState, action) => {
  switch (action.type) {
    case "LOG_IN_SUCCESSFUL":
      return action.token;
    case "LOG_OUT":
      return initialState;
    default:
      return state;
  }
};

export default token;
