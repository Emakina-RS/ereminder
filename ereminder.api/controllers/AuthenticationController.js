"use strict";

const jwt = require("jsonwebtoken");
const authentication = require("../middleware/authentication");
const passwordEncryptionHelper = require("../helpers/passwordEncryptionHelper");
const userService = require("../services/userService");

const jwtExpiryTime = global.globalConfig.jwtExpiryTimeInSeconds;

exports.Authenticate = async function(request, response) {
  const { username, password } = request.body;

  if (username && password) {
    let user = await userService.getUserByEmail(username);

    if (!user) {
      response.status(401).json({ message: "No such user found.", user });
      return;
    }

    let validPassword = await passwordEncryptionHelper.compare(
      password,
      user.password
    );

    if (validPassword) {
      let payload = { id: user.id };
      let token = jwt.sign(payload, authentication.JwtOptions.secretOrKey, {
        expiresIn: jwtExpiryTime
      });

      response.json({ message: "ok", token: token });
    } else {
      response
        .status(401)
        .json({ message: "Username and password combination is invalid." });
    }
  }
};
