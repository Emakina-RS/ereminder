'use strict'

const authenticationController = require('../controllers/AuthenticationController');
const accountController = require('../controllers/AccountController');
const notificationController = require('../controllers/NotificationController');
const calendarController = require('../controllers/CalendarController');
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

    app.get('/initconfig', authenticationHelper.EnsureAuthenticated(), notificationController.getConfigurationDashboard);

    app.post('/notifications', authenticationHelper.EnsureAuthenticated(), notificationController.UpdateNotifications);

    app.get('/notificationdashboard', authenticationHelper.EnsureAuthenticated(), notificationController.getNotificationDashboard);

    //TODO: add the input validation, for dates (from/to)
    app.get('/calendar', authenticationHelper.EnsureAuthenticated(), calendarController.GetCalendar);
};