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

export const getInitialData = () => (dispatch, getState) => {
  const { token } = getState();
  console.log("Fetching data with token: " + token);
  dispatch({ type: "GET_INITIAL_DATA" });
  setTimeout(() => {
    if (Math.random() > 0.5) {
      dispatch({ type: "GET_INITIAL_DATA_SUCCESSFUL", hasData: true });
    } else {
      dispatch({ type: "GET_INITIAL_DATA_SUCCESSFUL", hasData: false });
    }
  }, 1000);
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
