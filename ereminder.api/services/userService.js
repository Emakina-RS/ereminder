const models = require("../models");
const appendQuery = require("append-query");
const util = require("util");
const passwordEncryptionHelper = require("../helpers/passwordEncryptionHelper");
const mailer = require("../core/mailer");
const ecryptionHelper = require("../helpers/encryptionHelper");
const logger = require("../startup/logger")();
const BadInputError = require("../errors/BadInputError");
const constants = require("../config/constants");

require("../config/config");
const siteUrls = global.globalConfig.siteUrls;

exports.register = async function(email, password) {
  await ensureUserDoesNotExist(email);

  let user = await passwordEncryptionHelper.getEncryptedValue(
    password,
    passwordHash => {
      return createUser(email, passwordHash);
    }
  );

  let emailProperties = {
    logoUrl: global.globalConfig.logoUrl,
    siteUrl: siteUrls.root,
    confirmRegistrationUrl: getUrlWithToken(user, siteUrls.confirmRegistration)
  };

  await mailer.send(constants.emailTemplates.confirmRegistration, emailProperties, email);

  return user;
};

exports.registerConfirmation = async function(token) {
  let userId = getUserIdFromToken(token);
  let user = await models.User.findOne({ id: userId });

  if (!user) {
    throw BadInputError("Non-existing user");
  }

  await models.User.update({ isVerified: true }, { where: { id: userId } });

  logger.info(
    `[Service:UserService:RegisterConfirmation] : User with id: ${userId} has sucessfully confirmed registration.`
  );
};

exports.sendForgotPasswordEmail = async function(email) {
  let user = await exports.getUserByEmail(email);

  if (!user) {
    return false;
  }

  let emailProperties = {
    logoUrl: global.globalConfig.logoUrl,
    siteUrl: siteUrls.root,
    resetPasswordUrl: getUrlWithToken(user, siteUrls.resetPassword)
  }

  await mailer.send(constants.emailTemplates.resetPassword, emailProperties, email);

  logger.info(
    `[Service:UserService:SendForgotPasswordEmail] : System send reset password mail to user with id: ${user.id}.`
  );
};

exports.resetPassword = async function(token, password) {
  let userId = getUserIdFromToken(token);
  let user = await exports.getUserById(userId);

  if (!user) {
    throw BadInputError("Non-existing user");
  }

  let passwordHashed = await passwordEncryptionHelper.getEncryptedValue(
    password
  );
  await models.User.update(
    { password: passwordHashed },
    { where: { id: userId } }
  );
};

exports.getUserById = async function(userId) {
  return await models.User.findOne({ where: { id: userId, isVerified: true } });
};

exports.getUserByEmail = async function(email) {
  return await models.User.findOne({
    where: { email: email, isVerified: true }
  });
};

async function ensureUserDoesNotExist(email) {
  let user = await models.User.findOne({
    where: { email: email }
  });

  if (user !== null) {
    if (user.isVerified) {
      throw new Error("Invalid user data provided.");
    } else {
      await user.destroy();
    }
  }
}

async function createUser(email, password) {
  return models.User.create({
    email: email,
    password: password,
    isVerified: false
  }).then(newUser => {
    return newUser;
  });
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
    throw new BadInputError("Invalid token.");
  }
}

function getUrlWithToken(user, baseUrl) {
  let token = getUserToken(user);
  return appendQuery(baseUrl, "q=" + token);
}