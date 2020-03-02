import { combineReducers } from "redux";

const defaultHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

const get = (relativePath, token) => {
  let headers = defaultHeaders;

  if (token) {
    headers.Authorization = "Bearer " + token;
  }

  return fetch(getFullApiUrl(relativePath), {
    method: "GET",
    headers,
  }).then(response => response.json());
};

const post = (relativePath, payload, token) => {
  let headers = defaultHeaders;

  if (token) {
    headers.Authorization = "Bearer " + token;
  }

  return fetch(getFullApiUrl(relativePath), {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  }).then(response => response.json());
};

const patch = (relativePath, payload, token) => {
  let headers = defaultHeaders;

  if (token) {
    headers.Authorization = "Bearer " + token;
  }

  return fetch(getFullApiUrl(relativePath), {
    method: "PATCH",
    headers,
    body: JSON.stringify(payload)
  }).then(response => response.json());
};

const fetchRefreshToken = async (auth, dispatch) => {
  if (!auth) return;

  const currentTime = (new Date().getTime() / 1000) + 300;

  const diffTime = (auth.arrivedTokenTime + auth.expiresIn) - currentTime;
  const isBetween5minutebeforeExpired = diffTime > 0 && diffTime < 300;
  if (!isBetween5minutebeforeExpired) return;

  const notTimeForExpire = !(auth.refreshToken && currentTime > auth.expiresIn);
  if (notTimeForExpire) return;

  let headers = defaultHeaders;
  const payload = { refreshToken: auth.refreshToken };

  const response = await fetch(getFullApiUrl("/token"), {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });
  let data = await response.json();
  const { token, refreshToken, expiresIn } = data;

  const authProps = { token: token, refreshToken: refreshToken, expiresIn: expiresIn };
  dispatch({ type: "GOT_AUTH", auth: authProps });
  dispatch({ type: "GOT_TOKEN", token });
};
//TODO - move this somewhere and update it as per the comments bellow
const getCalendarFileAction = (state) => {
  //return `cancel` if user had Calendar checked and unchecked it
  //return `publish` if user updated notification intervals or start dates or checked Calendar checkbox
  //return empty string if nothing is updated
  return '';
};

export const getConfiguration = () => (dispatch, getState) => {
  fetchRefreshToken(getState().auth, dispatch);

  get("/configuration", getState().token).then(configuration => {
    dispatch({
      type: "CONFIGURATION_RECEIVED",
      configuration
    });
  });
};

export const changeDate = (fieldValue, fieldName) => dispatch => {
  dispatch({ type: "DATE_CHANGED", fieldValue, fieldName });
};

export const createOrUpdateConfiguration = dates => (dispatch, getState) => {
  fetchRefreshToken(getState().auth, dispatch);

  get("/configuration", getState().token).then(configuration => {
    if (configuration.id) {
      patch("/configuration", dates, getState().token)
        .then(() => { getConfiguration()(dispatch, getState) })
        .catch(() => console.log("Configuration update failed."));
    } else {
      post("/configuration", dates, getState().token)
        .then(() => { getConfiguration()(dispatch, getState) })
        .catch(() => console.log("Configuration addition failed."));
    }
  });
};

export const calendarChangeMonth = (month) => dispatch => {
  dispatch({ type: "CALENDAR_CHANGE_MONTH", data: month });
};

export const getCalendar = ({ startDate, endDate }) => (dispatch, getState) => {
  fetchRefreshToken(getState().auth, dispatch);
  let calendarFileAction = getCalendarFileAction(getState());
  get(`/calendar/startdate/${startDate}/enddate/${endDate}/${calendarFileAction}`, getState().token).then(calendarData => {
    dispatch({
      type: "CALENDAR_DATA_RECEIVED",
      data: calendarData
    });
  })
};

export const getNotificationDashboard = () => (dispatch, getState) => {
  fetchRefreshToken(getState().auth, dispatch);

  get("/notificationdashboard", getState().token).then(
    notificationDashboard => {
      dispatch({
        type: "NOTIFICATION_PAGE_RECEIVED",
        data: notificationDashboard
      });
    }
  );
};

export const updateNotificationDashboard = (dashboard) => (dispatch, getState) => {
  fetchRefreshToken(getState().auth, dispatch);

  post("/notifications", dashboard, getState().token).then(
    resultMessage => {
      dispatch({
        type: "NOTIFICATION_DASHBOARD_SAVED"
      });
    }
  );
};

export const toggleNotificationSelect = notification => dispatch => {
  dispatch({
    type: "NOTIFICATION_CHECKBOX_TOGGLE",
    data: notification
  });
};

export const toggleIntervalSelect = interval => dispatch => {
  dispatch({
    type: "INTERVAL_RADIO_BUTTON_TOGGLE",
    data: interval
  });
};

export const logIn = (email, password) => dispatch => {
  dispatch({ type: "LOG_IN" });
  post("/authenticate", {
    username: email,
    password
  }).then(({ token, refreshToken, expiresIn }) => {
    if (token === undefined) {
      dispatch({ type: "LOG_IN_FAILED" });
    } else {
      dispatch({ type: "LOG_IN_SUCCESSFUL", token, email });
      const auth = { token: token, refreshToken: refreshToken, expiresIn: expiresIn };
      dispatch({ type: "GOT_AUTH", auth });
    }
  });
};

export const register = (email, password, confirmPassword) => dispatch => {
  dispatch({ type: "REGISTER" });
  post("/register", {
    email,
    password,
    confirmPassword
  })
    .then(response => {
      if (response.message === "Something failed.") {
        dispatch({
          type: "REGISTER_FAILED",
          data: "Došlo je do greške. Pokušajte ponovo!"
        });
      } else {
        dispatch({
          type: "REGISTER_SUCCESSFUL",
          data: "Poslat Vam je mejl za potvrdu registracije!"
        });
      }
    })
    .catch(() => dispatch({ type: "REGISTER_FAILED" }));
};

export const loadRegister = () => dispatch => {
  dispatch({ type: "LOAD_REGISTER" });
};

export const forgotPassword = email => dispatch => {
  dispatch({ type: "FORGOT_PASSWORD" });
  post("/forgotpassword", {
    email
  })
    .then(res => {
      if (res.errors && res.errors.length > 0) {
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

export const registerConfirmation = token => dispatch => {
  post("/confirmregistration", {
    token
  })
    .then(res => {
      if (res.errors && res.errors.length > 0) {
        dispatch({ type: "IS_SUBMITTING_FAILURE" });
      } else {
        dispatch({ type: "IS_CONFIRMED" });
      }
    })
    .catch(() => {
      dispatch({ type: "IS_SUBMITTING_FAILURE" });
    });
};

export const resetPassword = (token,password,confirmPassword) => dispatch => {
  post("/resetpassword", {
    token,password,confirmPassword
  }).then(res => {
    if (res.errors && res.errors.length > 0) {
      dispatch({ type: "IS_SUBMITTING_FAILURE" });
    } else {
      dispatch({ type: "IS_CONFIRMED" });
    }
  })
}

export const passwordInputField = (data) => dispatch => {
  dispatch({ type: "PASSWORD_INPUT",  data});
};

function getFullApiUrl(relativePath) {
  return process.env.REACT_APP_API_URL + relativePath;
}