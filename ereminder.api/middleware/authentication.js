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
  return new JwtStrategy(jwtOptions, async function(jwtPayload, next) {
    if (!jwtPayload.exp) {
      return next(null, false);
    }

    var expirationDate = new Date(jwtPayload.exp * 1000);
    var currentDate = new Date();
    if (expirationDate < currentDate) {
      return next(null, false);
    }

    let user = await userService.getUserById(jwtPayload.id);

    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });
}
