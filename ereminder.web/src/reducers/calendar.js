import {
   startOfDay
} from "date-fns";

const initialState = {
  date: startOfDay(new Date())
};

const calendar = (state = initialState, action) => {
  switch (action.type) {
    case "CALENDAR_DATA_RECEIVED":
      return {
        ...state,
        calendarData: action.data
      };
    case "CALENDAR_CHANGE_MONTH":
      return {
        ...state,
        date: action.data
      };
    default:
      return state;
  }
};

export default calendar;
