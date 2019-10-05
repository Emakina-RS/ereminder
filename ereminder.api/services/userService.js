const models = require('../models');
const appendQuery = require('append-query');
const util = require('util');
const passwordEncryptionHelper = require('../helpers/passwordEncryptionHelper');
const mailer = require('../core/mailer');
const ecryptionHelper = require('../helpers/encryptionHelper');

const config = require('../config/config');
const siteUrls = global.globalConfig.siteUrls;
const mailSubjects = global.globalConfig.mailSubjects;

module.exports.register = async function(body) {
    let result =  await passwordEncryptionHelper.getEncryptedValue(body.password, (hash) => {
         return createUser(hash, body);
    });

     return result;
}

module.exports.sendForgotPasswordEmail = async function(email) {
     let user = await models.User.findOne({ email });

     if (!user) {
          return false;
     }

     let token = getResetPasswordToken(user);
     let body = "<b>Reset your password:</b>" + appendQuery(siteUrls.resetPassword, 'q=' + token);

     await mailer.send(mailSubjects.resetPasswordSubject, body, email);
}

async function createUser(hash, body) {
   return models.User.create({
        email: body.email,
        password: hash,
    })
    .then((newUser) => { return newUser; });
}

function getResetPasswordToken(user) {
     let date = new Date();
     date.setHours(date.getHours() + 1);

     let token = util.format('id=%s&validByDate=%s', user.id, date);
     return ecryptionHelper.Encrypt(token);
}