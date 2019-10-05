'use strict'

const authenticationController = require('../controllers/AuthenticationController');
const accountController = require('../controllers/AccountController');
const notificationController = require('../controllers/NotificationController');
const authenticationHelper = require('../helpers/AuthenticationHelper');
const userValidator = require('../validators/userValidator');

module.exports = function(app) {
    app.post('/authenticate', userValidator.validateLogin, (req,res) => userValidator.returnValidationResults(req, res, authenticationController.Authenticate));

    app.route('/register',)
        .post(userValidator.validateRegister, (req,res) => userValidator.returnValidationResults(req, res, accountController.Register));

    app.route('/resetpassword')
        .post(userValidator.ResetPassword, (req,res) => userValidator.returnValidationResults(req, res, accountController.ResetPassword));

    app.route('/forgotpassword')
        .post(userValidator.ResetPassword, (req,res) => userValidator.returnValidationResults(req, res, accountController.ForgotPassword));

    app.post('/notification', authenticationHelper.EnsureAuthenticated(), notificationController.CreateNotification);
};