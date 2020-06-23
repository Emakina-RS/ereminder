const initialState = {
  data: {},
  dashboardLoaded: false,
  shouldRedirect: false
};

const notificationDashboard = (state = initialState, action) => {
  switch (action.type) {
    case "NOTIFICATION_PAGE_RECEIVED":
      return {
        ...state,
        data: action.data,
        dashboardLoaded: true,
        shouldRedirect: false
      };
    case "NOTIFICATION_DASHBOARD_SAVED":
      return {
        ...state,
        dashboardLoaded: false,
        shouldRedirect: true
      };
    case "RESET_DASHBOARD_LOADED":
      return {
        ...state,
        dashboardLoaded: false
      };
    case "CHECK_NOTIFICATION_CHECKBOX":
      return {
        ...state,
        data: {
          ...state.data,
          [action.data]: {
            ...state.data[action.data],
            checked: true, // we check the notification checkbox
            intervals: [
              {
                ...state.data[action.data].intervals[0],
                checked: true // and we check the first interval radio button of that notification
              },
              ...state.data[action.data].intervals.slice(1)
            ]
          }
        }
      };
    case "UNCHECK_NOTIFICATION_CHECKBOX":
      return {
        ...state,
        data: {
          ...state.data,
          [action.data]: {
            ...state.data[action.data],
            checked: false, // we uncheck the notification checkbox
            intervals: state.data[action.data].intervals.map(interval => {
              return {
                ...interval,
                checked: false // and we uncheck all interval radio buttons of that notification
              }
            })
          }
        }
      };
    case "INTERVAL_RADIO_BUTTON_TOGGLE":
      return {
        ...state,
        data: {
          ...state.data,
          [action.data.notificationType]: {
            ...state.data[action.data.notificationType],
            checked: true, // we check the notification checkbox
            intervals: state.data[action.data.notificationType].intervals.map((interval, index) => {
              return {
                ...interval,
                // and we uncheck all interval radio buttons of that notification except the selected
                checked: index === action.data.intervalIndex ? true : false
              }
            })
          }
        }
      };
    default:
      return state;
  }
};

export default notificationDashboard;
