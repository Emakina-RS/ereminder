const defaultHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

const get = (relativePath, payload, token) => {
  let headers = defaultHeaders;

  if (token) {
    headers.Authorization = "Bearer " + token;
  }

  return fetch(getFullApiUrl(relativePath), {
    method: "GET",
    headers,
    body: JSON.stringify(payload)
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

export const getConfiguration = () => (dispatch, getState) => {
  fetchRefreshToken(getState().auth, dispatch);

  get("/configuration", undefined, getState().token).then(configuration => {
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

  get("/configuration", undefined, getState().token).then(configuration => {
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

  post(`/calendar`, { startDate, endDate }, getState().token).then(calendarData => {
    dispatch({
      type: "CALENDAR_DATA_RECEIVED",
      data: calendarData
    });
  })
};

export const getNotificationDashboard = () => (dispatch, getState) => {
  fetchRefreshToken(getState().auth, dispatch);

  get("/notificationdashboard", undefined, getState().token).then(
    notificationDashboard => {
      dispatch({
        type: "NOTIFICATION_PAGE_RECEIVED",
        data: notificationDashboard
      });
    }
  );
};

export const updateNotificationDashboard = (notificationConfig) => (dispatch, getState) => {
  fetchRefreshToken(getState().auth, dispatch);

  post("/notifications", notificationConfig, getState().token).then(
    notificationDashboard => {
      getNotificationDashboard()(dispatch, getState)
      dispatch({
        type: "NOTIFICATION_PAGE_UPDATED",
        data: notificationDashboard
      });
    }
  );
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
        dispatch({ type: "REGISTER_FAILED" });
      } else {
        dispatch({
          type: "REGISTER_SUCCESSFUL",
          data: "Poslat Vam je mejl za potvrdu registracije!"
        });
      }
    })
    .catch(() => dispatch({ type: "REGISTER_FAILED" }));
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

export const verifyRecaptcha = async token => {
  return post("/verifyRecaptcha", {
    token
  })
    .then(res => {
      return res;
    })
    .catch(() => {
      return { success: false, message: "Server unavailable" };
    });
};

function getFullApiUrl(relativePath) {
  return process.env.REACT_APP_API_URL + relativePath;
}
