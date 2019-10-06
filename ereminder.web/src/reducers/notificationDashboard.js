const initialState = {};

const notificationDashboard = (state = initialState, action) => {
  switch (action.type) {
    case "NOTIFICATION_PAGE_RECEIVED":
      return notificationDashboard;
    default:
      return state;
  }
};

export default notificationDashboard;
