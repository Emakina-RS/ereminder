'use strict'

const passport = require('passport');
const passportJWT = require('passport-jwt');
const models  = require('../models');
const jwt = require('jsonwebtoken');
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: '#dMz8Jk1L76HHFhEzYvD6o@BfYGo^76i'
};

module.exports = function(app) {
    let strategy = getPassportStrategy();
    passport.use(strategy);

    app.use(passport.initialize());
}

module.exports.EnsureAuthenticated = function() {
    return passport.authenticate('jwt', { session: false });
}

module.exports.JwtOptions = jwtOptions;

module.exports.getUserIdFromRequest = function(req){
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, jwtOptions.secretOrKey);
        } catch (e) {
             return null;
        }
        return decoded.id;
    }

    return null;

}

function getPassportStrategy() {

    return new JwtStrategy(jwtOptions, function(jwt_payload, next) {

        let user = models.User.findOne({ id: jwt_payload.id });

        if (user) {
            next(null, user);
        }
        else {
            next(null, false);
        }
    });
}

