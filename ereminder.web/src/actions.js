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
