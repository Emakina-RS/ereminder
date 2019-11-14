"use strict";

const jwt = require("jsonwebtoken");
const authentication = require("../middleware/authentication");
const passwordEncryptionHelper = require("../helpers/passwordEncryptionHelper");
const userService = require("../services/userService");
const randtoken = require('rand-token');

//TODO: this is a temp solution (better to keep it in the database)
var refreshTokens = {};

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
      let token = getTokenByPayload(payload);

      response.json(token);
    }
    else {
      response
        .status(401)
        .json({ message: "Username and password combination is invalid." });
    }
  }
};

exports.RefreshToken = async function(request, response) {
  const { refreshToken } = request.body;

  if (refreshToken in refreshTokens) {
    let payload = refreshTokens[refreshToken];
    let token = getTokenByPayload(payload);

    delete refreshTokens[refreshToken];

    response
      .status(200)
      .json(token);

    return;
  }

  response
    .status(400)
    .json({ message: "Invalid refresh token provided." });
};

function getTokenByPayload(payload) {
  let token = jwt.sign(payload, authentication.JwtOptions.secretOrKey, {
    expiresIn: global.globalConfig.jwtExpiryTimeInSeconds
  });

  let refreshToken = randtoken.uid(50);
  refreshTokens[refreshToken] = payload;

  return {
    tokenType: "bearer",
    token: token,
    expiresIn: global.globalConfig.jwtExpiryTimeInSeconds,
    refreshToken: refreshToken
  }
}