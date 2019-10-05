'use strict'

const jwt = require('jsonwebtoken');
const AuthenticationHelper = require('../helpers/AuthenticationHelper');

exports.Authenticate = async function(request, response, next) {
    const { username, password } = request.body;

    if (username && password) {
        let user = await getUser({ username });

        if (!user) {
            response.status(401).json({ msg: 'No such user found', user });
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

//TODO: remove this when we get repositories ready
const getUser = async obj => {
    var user = {
        id: 1,
        name: 'dejan',
        password: 'ostojic'
    }

    return Promise.resolve(user);
}