'use strict'

const jwt = require('jsonwebtoken');
const models  = require('../models');
const authenticationHelper = require('../helpers/authenticationHelper');
const passwordEncryptionHelper = require('../helpers/passwordEncryptionHelper');

exports.Authenticate = async function(request, response) {
    const { username, password } = request.body;

    if (username && password) {
        let user = await models.User.findOne({where: { email: username }});

        if (!user) {
            response.status(401).json({ msg: 'No such user found', user });
            return;
        }

        let validPassword = await passwordEncryptionHelper.compare(password, user.password);

        if (validPassword) {
            let payload = { id: user.id };
            let token = jwt.sign(payload, authenticationHelper.JwtOptions.secretOrKey);

            response.json({ msg: 'ok', token: token });
        }
        else {
            response.status(401).json({ msg: 'Password is incorrect' });
        }
    }
}