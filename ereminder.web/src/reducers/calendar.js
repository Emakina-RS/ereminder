import {
   startOfDay
} from "date-fns";

const initialState = {
  date: startOfDay(new Date()),
  calendarFileAction: ''
};

const calendar = (state = initialState, action) => {
  switch (action.type) {
    case "CALENDAR_DATA_RECEIVED":
      return {
        ...state,
        calendarData: action.data,
        calendarFileAction: ''
      };
    case "CALENDAR_CHANGE_MONTH":
      return {
        ...state,
        date: action.data
      };
    case "UPDATE_CALENDAR_FILE_ACTION":
      return {
        ...state,
        calendarFileAction: action.data
      }
    default:
      return state;
  }
};

export default calendar;
