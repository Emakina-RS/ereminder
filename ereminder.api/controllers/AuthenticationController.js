"use strict";

const jwt = require("jsonwebtoken");
const authenticationHelper = require("../helpers/authenticationHelper");
const passwordEncryptionHelper = require("../helpers/passwordEncryptionHelper");
const userService = require("../services/userService");

exports.Authenticate = async function(request, response) {
  const { username, password } = request.body;

  if (username && password) {
    let user = await userService.getUserByEmail(username);

    if (!user) {
      response.status(401).json({ msg: "No such user found.", user });
      return;
    }

    let validPassword = await passwordEncryptionHelper.compare(
      password,
      user.password
    );

    if (validPassword) {
      let payload = { id: user.id };
      let token = jwt.sign(
        payload,
        authenticationHelper.JwtOptions.secretOrKey
      );

      response.json({ msg: "ok", token: token });
    } else {
      response
        .status(401)
        .json({ msg: "Username and password combination is invalid." });
    }
  }
};
