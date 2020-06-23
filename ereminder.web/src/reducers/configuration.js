import moment from "moment";

const initialState = {
  dates: {
    lastTimeTookPills: "",
    lastTimeTookPillsTime: "",
    lastTimeInPharmacy: "",
    lastTimeGotPrescription: "",
    lastTimeGotReferral: "",
    lastTimeExamination: ""
  },
  activeNotifications: {
    enableEmailNotification: false,
    enableCalendarNotification: false
  },
  configurationReceived: false
};

const configuration = (state = initialState, action) => {
  switch (action.type) {
    case "CONFIGURATION_RECEIVED":
      var lastTimeTookPillsArray = [];
      if (action.configuration.lastTimeTookPills) {
        lastTimeTookPillsArray = moment(action.configuration.lastTimeTookPills)
          .format("YYYY-MM-DD HH:mm")
          .split(" ");
      }
      return {
        dates: {
          lastTimeTookPills: lastTimeTookPillsArray[0],
          lastTimeTookPillsTime: lastTimeTookPillsArray[1],
          lastTimeInPharmacy: action.configuration.lastTimeInPharmacy,
          lastTimeGotPrescription: action.configuration.lastTimeGotPrescription,
          lastTimeGotReferral: action.configuration.lastTimeGotReferral,
          lastTimeExamination: action.configuration.lastTimeExamination
        },
        activeNotifications: {
          enableEmailNotification: action.configuration.enableEmailNotification,
          enableCalendarNotification: action.configuration.enableCalendarNotification
        },
        configurationReceived: true
      };
    case "DATE_CHANGED":
      const dates = { ...state.dates };
      dates[action.fieldName] = action.fieldValue;
      return {
        ...state,
        dates
      };
    case "NOTIFICATION_TYPE_CHANGED":
      return {
        ...state,
        activeNotifications: {
          ...state.activeNotifications,
          [action.key]: action.value
        }
      };
    default:
      return state;
  }
};

export default configuration;
