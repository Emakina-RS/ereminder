const models = require('../models');
const appendQuery = require('append-query');
const util = require('util');
const passwordEncryptionHelper = require('../helpers/passwordEncryptionHelper');
const mailer = require('../core/mailer');
const ecryptionHelper = require('../helpers/encryptionHelper');

require('../config/config');
const siteUrls = global.globalConfig.siteUrls;
const mailSubjects = global.globalConfig.mailSubjects;

exports.register = async function (email, password) {
     let result =  await passwordEncryptionHelper.getEncryptedValue(password, (passwordHash) => {
          return createUser(email, passwordHash);
     });

     return result;
}

exports.sendForgotPasswordEmail = async function(email) {
     let user = await models.User.findOne({ email });

     if (!user) {
          return false;
     }

     let token = getResetPasswordToken(user);
     let body = "<b>Reset your password:</b>" + appendQuery(siteUrls.resetPassword, 'q=' + token);//TODO: implement proper email template

     await mailer.send(mailSubjects.resetPasswordSubject, body, email);
}

exports.resetPassword = async function(token, password) {
     let userId = getUserIdFromToken(token);
     let user = await models.User.findOne({ id: userId });

     if (!user) {
          throw Error("Non-existing user");
     }

     let passwordHashed = await passwordEncryptionHelper.getEncryptedValue(password);
     await models.User.update( { password: passwordHashed }, { where: { id: userId} });
}

async function createUser(email, password) {
   return models.User.create({
        email: email,
        password: password,
    })
    .then((newUser) => { return newUser; });
}

function getResetPasswordToken(user) {
     let date = new Date();
     date.setHours(date.getHours() + 1);

     let token = util.format('{ "id": "%s", "validByDate": "%s" }', user.id, date);

     return ecryptionHelper.Encrypt(token);
}

function getUserIdFromToken(token) {
     let decryptedToken = ecryptionHelper.Decrypt(token);
     let tokenJson = JSON.parse(decryptedToken);

     ensureTokenDateIsValid(tokenJson.validByDate);

     return tokenJson.id;
}

function ensureTokenDateIsValid(date) {
     let tokenDate = new Date(date);
     let currentDate = new Date();

     if (tokenDate.getTime() < currentDate.getTime()) {
          throw new Error("Invalid token.");
     }
}