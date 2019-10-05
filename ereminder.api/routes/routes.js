'use strict'

const authenticationController = require('../controllers/AuthenticationController');
const accountController = require('../controllers/AccountController');
const notificationController = require('../controllers/NotificationController');
const authenticationHelper = require('../helpers/AuthenticationHelper');

module.exports = function(app) {
    app.route('/authenticate')
        .post(authenticationController.Authenticate);

    app.route('/register')
        .post(accountController.Register);

    app.route('/resetpassword')
        .post(accountController.ResetPassword);

    app.post('/notification', authenticationHelper.EnsureAuthenticated(), notificationController.CreateNotification);
};