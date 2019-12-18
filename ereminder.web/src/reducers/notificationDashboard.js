const initialState = {
  data: {},
  receivedNotification: false
};

const notificationDashboard = (state = initialState, action) => {
  switch (action.type) {
    case "NOTIFICATION_PAGE_RECEIVED":
      return {
        ...state,
        data: action.data,
        receivedNotification: true
      };
    default:
      return state;
  }
};

export default notificationDashboard;
