"use strict";

const passport = require("passport");
const passportJWT = require("passport-jwt");
const userService = require("../services/userService");

let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "#dMz8Jk1L76HHFhEzYvD6o@BfYGo^76i"
};

module.exports = function(app) {
  let strategy = getPassportStrategy();
  passport.use(strategy);

  app.use(passport.initialize());
};

module.exports.EnsureAuthenticated = function() {
  return passport.authenticate("jwt", { session: false });
};

module.exports.JwtOptions = jwtOptions;

function getPassportStrategy() {
  return new JwtStrategy(jwtOptions, async function(jwt_payload, next) {
    let user = await userService.getUserById(jwt_payload.id);

    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });
}
