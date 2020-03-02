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
    case "NOTIFICATION_CHECKBOX_TOGGLE":
      state.data[action.data.notificationType].checked = action.data.checked;

      if (action.data.checked) {
        state.data[action.data.notificationType].intervals[0].checked = true;
        state.data[action.data.notificationType].intervalId = state.data[action.data.notificationType].intervals[0].id;
      } else {
        state.data[action.data.notificationType].intervalId = null;
        state.data[action.data.notificationType].intervals.map(interval => {
          return interval.checked = false;
        });
      }

      return {
        ...state
      };
    case "INTERVAL_RADIO_BUTTON_TOGGLE":
      state.data[action.data.notificationType].intervals.map(interval => {
        return interval.checked = false;
      });
      state.data[action.data.notificationType].intervals[action.data.intervalIndex].checked = true;
      state.data[action.data.notificationType].checked = true;

      return {
        ...state
      };
    default:
      return state;
  }
};

export default notificationDashboard;
