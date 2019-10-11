const models = require('../models');
const appendQuery = require('append-query');
const util = require('util');
const passwordEncryptionHelper = require('../helpers/passwordEncryptionHelper');
const mailer = require('../core/mailer');
const ecryptionHelper = require('../helpers/encryptionHelper');

require('../config/config');
const siteUrls = global.globalConfig.siteUrls;
const mailSubjects = global.globalConfig.mailSubjects;

exports.register = async function(email, password) {
     await ensureUserDoesNotExist(email);

     let user =  await passwordEncryptionHelper.getEncryptedValue(password, (passwordHash) => {
          return createUser(email, passwordHash);
     });

     let body = getConfirmRegistrationEmailBody(user);
     await mailer.send(mailSubjects.confirmRegistrationSubject, body, email);

     return user;
}

exports.registerConfirmation = async function(token) {
     let userId = getUserIdFromToken(token);
     let user = await models.User.findOne({ id: userId });

     if (!user) {
          throw Error("Non-existing user");
     }

     await models.User.update( { isVerified: true }, { where: { id: userId} });
}

exports.sendForgotPasswordEmail = async function(email) {
     let user = await exports.getUserByEmail(email);

     if (!user) {
          return false;
     }

     let body = getResetPasswordEmailBody(user);
     await mailer.send(mailSubjects.resetPasswordSubject, body, email);
}

exports.resetPassword = async function(token, password) {
     let userId = getUserIdFromToken(token);
     let user = await exports.getUserById(userId);

     if (!user) {
          throw Error("Non-existing user");
     }

     let passwordHashed = await passwordEncryptionHelper.getEncryptedValue(password);
     await models.User.update( { password: passwordHashed }, { where: { id: userId} });
}

exports.getUserById = async function(userId) {
     return await models.User.findOne({ where: { id: userId, isVerified: true } });
}

exports.getUserByEmail = async function(email) {
     return await models.User.findOne({ where: { email: email, isVerified: true } });
}

async function ensureUserDoesNotExist(email) {
     let user = await exports.getUserByEmail(email);

     if (user !== null) {
          throw new Error('Invalid user data provided.');
     }
}

async function createUser(email, password) {
   return models.User.create({
        email: email,
        password: password,
        isVerified: false
    })
    .then((newUser) => { return newUser; });
}

function getUserToken(user) {
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

function getConfirmRegistrationEmailBody(user) {
     let token = getUserToken(user);

     //TODO: implement proper email template
     return "<b>Confirm your registration: </b>" + appendQuery(siteUrls.confirmRegistration, 'q=' + token);
}

function getResetPasswordEmailBody(user) {
     let token = getUserToken(user);

     //TODO: implement proper email template
     return "<b>Reset your password: </b>" + appendQuery(siteUrls.resetPassword, 'q=' + token);
}