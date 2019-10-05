'use strict'

const jwt = require('jsonwebtoken');
const AuthenticationHelper = require('../helpers/AuthenticationHelper');
const models  = require('../models');

exports.Authenticate = async function(request, response) {

    const { username, password } = request.body;

    if (username && password) {
        let user = await models.User.findOne({ username });

        if (!user) {
            response.status(401).json({ msg: 'No such user found', user });
            return;
        }

        if (user.password === password) {
            let payload = { id: user.id };
            let token = jwt.sign(payload, AuthenticationHelper.JwtOptions.secretOrKey);

            response.json({ msg: 'ok', token: token });
        }
        else {
            response.status(401).json({ msg: 'Password is incorrect' });
        }
    }
}