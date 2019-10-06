const initialState = {};

const calendar = (state = initialState, action) => {
  switch (action.type) {
    case "CALENDAR_DATA":
      return { data: action.data };
    default:
      return state;
  }
};

export default calendar;
