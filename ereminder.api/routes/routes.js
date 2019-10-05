'use strict'

const authenticationController = require('../controllers/AuthenticationController');
const accountController = require('../controllers/AccountController');
const notificationController = require('../controllers/NotificationController');
const authenticationHelper = require('../helpers/authenticationHelper');
const userValidator = require('../validators/userValidator');

module.exports = function(app) {
    app.post('/authenticate', userValidator.validateLogin,
        (req, res) => userValidator.returnValidationResults(req, res, authenticationController.Authenticate));

    app.post('/register', userValidator.validateRegister,
        (req, res) => userValidator.returnValidationResults(req, res, accountController.Register));

    app.post('/resetpassword', userValidator.validateResetPassword,
        (req, res) => userValidator.returnValidationResults(req, res, accountController.ResetPassword));

    app.post('/forgotpassword', userValidator.validateForgotPassword,
        (req, res) => userValidator.returnValidationResults(req, res, accountController.ForgotPassword));

    app.post('/initconfig', userValidator.validateConfigInitialization,
        (req, res) => userValidator.returnValidationResults(req, res, accountController.SetInitConfiguration));

    app.post('/notification', authenticationHelper.EnsureAuthenticated(), notificationController.CreateNotification);
};