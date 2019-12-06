const initialState = {};

const calendar = (state = initialState, action) => {
  switch (action.type) {
    case "CALENDAR_DATA_RECEIVED":
      return { data: action.data };
    default:
      return state;
  }
};

export default calendar;
