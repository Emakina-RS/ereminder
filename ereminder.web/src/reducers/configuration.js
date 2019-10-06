const initialState = {
  configuration: null,
  configurationReceived: false
};

const configuration = (state = initialState, action) => {
  switch (action.type) {
    case "INITIAL_CONFIGURATION_RECEIVED":
      return {
        configuration: action.configuration,
        configurationReceived: true
      };
    default:
      return state;
  }
};

export default configuration;
