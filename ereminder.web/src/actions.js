const headers = { "Content-Type": "application/json" };

export const logIn = (email, password) => dispatch => {
  dispatch({ type: "LOG_IN" });
  fetch("/authenticate", {
    method: "POST",
    headers,
    body: JSON.stringify({
      username: email,
      password
    })
  })
    .then(response => response.json())
    .then(({ token }) => {
      if (token === undefined) {
        dispatch({ type: "LOG_IN_FAILED" });
      } else {
        dispatch({ type: "LOG_IN_SUCCESSFUL", token });
      }
    });
};
