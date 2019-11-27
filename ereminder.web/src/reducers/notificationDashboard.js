const initialState = {
  data: {},
  receivedNotification: false
};

const notificationDashboard = (state = initialState, action) => {
  switch (action.type) {
    case "NOTIFICATION_PAGE_RECEIVED":
      console.log(action.data);
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
