const defaultHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

const get = (path, payload, token) => {
  let headers = defaultHeaders;
  if (token) {
    headers.Authorization = "Bearer " + token;
  }
  return fetch(path, {
    method: "GET",
    headers,
    body: JSON.stringify(payload)
  }).then(response => response.json());
};

const post = (path, payload, token) => {
  let headers = defaultHeaders;
  if (token) {
    headers.Authorization = "Bearer " + token;
  }
  return fetch(path, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  }).then(response => response.json());
};

export const getConfiguration = () => (dispatch, getState) =>
  get("/configuration", undefined, getState().token).then(configuration => {
    dispatch({ type: "CALENDAR_DATA", data: mockJSON });
    dispatch({
      type: "INITIAL_CONFIGURATION_RECEIVED",
      configuration
    });
  });

export const getNotificationDashboard = () => (dispatch, getState) =>
  get("/notificationdashboard", undefined, getState().token).then(
    notificationDashboard =>
      dispatch({
        type: "NOTIFICATION_PAGE_RECEIVED",
        notificationDashboard
      })
  );

export const getInitialData = () => (dispatch, getState) => {
  const { token } = getState();
  console.log("Fetching data with token: " + token);
  dispatch({ type: "GET_INITIAL_DATA" });
  dispatch({ type: "CALENDAR_DATA", data: mockJSON });
  dispatch({ type: "GET_INITIAL_DATA_SUCCESSFUL", hasData: true });
};

export const logIn = (email, password) => dispatch => {
  dispatch({ type: "LOG_IN" });
  post("/authenticate", {
    username: email,
    password
  }).then(({ token }) => {
    if (token === undefined) {
      dispatch({ type: "LOG_IN_FAILED" });
    } else {
      dispatch({ type: "LOG_IN_SUCCESSFUL", token });
    }
  });
};

export const register = (email, password, confirmPassword) => dispatch => {
  dispatch({ type: "REGISTER" });
  post("/register", {
    email,
    password,
    confirmpassword: confirmPassword
  })
    .then(() => dispatch({ type: "REGISTER_SUCCESSFUL" }))
    .catch(() => dispatch({ type: "REGISTER_FAILED" }));
};

export const forgotPassword = (email) => dispatch => {
  dispatch({ type: "FORGOT_PASSWORD" });
  post("/forgotpassword", {
    email
  })
  .then((res) => {
    if(res.errors && res.errors.length > 0) {
      console.log("Invalid data.");
      dispatch({ type: "FORGOT_PASSWORD_FAILURE" });
    } else {
      console.log("Forgot password email has been sent.");
      dispatch({ type: "FORGOT_PASSWORD_SUCCESS" });
    }
  })
  .catch(() => {
    dispatch({ type: "FORGOT_PASSWORD_FAILURE" });
  });
};

export const closeModal = () => dispatch => {
  dispatch({ type: "CLOSE_MODAL" });
};

export const registerConfirmation = (token) => dispatch => {

  post("/registerConfirmation", {
    token
  })
  .then((res) => {
    if(res.errors && res.errors.length > 0) {
      dispatch({ type: "IS_SUBMITTING_FAILURE" });
    } else {
      dispatch({ type: "IS_CONFIRMED" });
    }
  })
  .catch(() => {
    dispatch({ type: "IS_SUBMITTING_FAILURE"});
  });
};

export const verifyRecaptcha = async (token) => {

  return (
    post("/verifyRecaptcha", {
      token
    })
    .then((res) => {
      return res;
    })
    .catch(() => {
      return { "success": false,
              "message": "Server unavailable"};
    }));
};

const mockJSON = {
  takeRecepieEveryHours: 12,
  reminders: {
    "2019/10/09": [
      {
        notificationTypeName: "recepti",
        notificationTypeId: 2
      },
      {
        notificationTypeName: "apoteka",
        notificationTypeId: 3
      }
    ],
    "2019/10/15": [
      {
        notificationTypeName: "recepti",
        notificationTypeId: 2
      }
    ],
    "2019/10/22": [
      {
        notificationTypeName: "recepti",
        notificationTypeId: 2
      },
      {
        notificationTypeName: "apoteka",
        notificationTypeId: 3
      },
      {
        notificationTypeName: "nalazi",
        notificationTypeId: 4
      }
    ],
    "2019/10/29": [
      {
        notificationTypeName: "recepti",
        notificationTypeId: 2
      }
    ]
  }
};
