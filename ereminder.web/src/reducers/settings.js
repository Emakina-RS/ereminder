const initialState = "";

const settings = (state = initialState, action) => {
  switch (action.type) {
    case "GET_INITIAL_DATA_SUCCESSFUL":
      return action.hasData ? "I have data." : "No data.";
    default:
      return state;
  }
};

export default settings;
