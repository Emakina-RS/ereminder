'use strict'

const authenticationController = require('../controllers/AuthenticationController');
const accountController = require('../controllers/AccountController');
const notificationController = require('../controllers/NotificationController');
const calendarController = require('../controllers/CalendarController');
const configurationController = require('../controllers/ConfigurationController');
const authenticationHelper = require('../helpers/authenticationHelper');
const userValidator = require('../validators/userValidator');

module.exports = function(app) {
    app.post('/authenticate', userValidator.validateLogin,
        (req, res) => userValidator.returnValidationResults(req, res, authenticationController.Authenticate));

    app.post('/register', userValidator.validateRegister,
        (req, res) => userValidator.returnValidationResults(req, res, accountController.Register));

    app.post('/registerconfirmation', userValidator.validateRegisterConfirmation,
        (req, res) => userValidator.returnValidationResults(req, res, accountController.RegisterConfirmation));

    app.post('/resetpassword', userValidator.validateResetPassword,
        (req, res) => userValidator.returnValidationResults(req, res, accountController.ResetPassword));

    app.post('/forgotpassword', userValidator.validateForgotPassword,
        (req, res) => userValidator.returnValidationResults(req, res, accountController.ForgotPassword));

    app.post('/configuration', userValidator.validateConfigInitialization,
        (req, res) => userValidator.returnValidationResults(req, res, configurationController.CreateConfiguration));

    app.get('/configuration', authenticationHelper.EnsureAuthenticated(), configurationController.GetConfiguration);
    app.patch('/configuration', authenticationHelper.EnsureAuthenticated(), configurationController.UpdateConfiguration);

    app.post('/notifications', authenticationHelper.EnsureAuthenticated(), notificationController.UpdateNotifications);

    app.get('/notificationdashboard', authenticationHelper.EnsureAuthenticated(), notificationController.GetNotificationDashboard);

    //TODO: add the input validation, for dates (startDate/endDate)
    app.get('/calendar', authenticationHelper.EnsureAuthenticated(), calendarController.GetCalendar);
};