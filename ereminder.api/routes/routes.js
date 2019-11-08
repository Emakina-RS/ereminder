"use strict";

require("express-async-errors");
const authenticationController = require("../controllers/AuthenticationController");
const accountController = require("../controllers/AccountController");
const notificationController = require("../controllers/NotificationController");
const calendarController = require("../controllers/CalendarController");
const configurationController = require("../controllers/ConfigurationController");
const authenticationHelper = require("../helpers/authenticationHelper");
const validators = require("../middleware/validators");

module.exports = function(app) {
  app.post("/authenticate", validators.validateLogin, (req, res) =>
    validators.returnValidationResults(
      req,
      res,
      authenticationController.Authenticate
    )
  );

  app.post("/register", validators.validateRegister, (req, res) =>
    validators.returnValidationResults(req, res, accountController.Register)
  );

  app.post(
    "/registerconfirmation",
    validators.validateRegisterConfirmation,
    (req, res) =>
      validators.returnValidationResults(
        req,
        res,
        accountController.RegisterConfirmation
      )
  );

  app.post("/resetpassword", validators.validateResetPassword, (req, res) =>
    validators.returnValidationResults(
      req,
      res,
      accountController.ResetPassword
    )
  );

  app.post("/forgotpassword", validators.validateForgotPassword, (req, res) =>
    validators.returnValidationResults(
      req,
      res,
      accountController.ForgotPassword
    )
  );

  app.post(
    "/configuration",
    validators.validateConfigInitialization,
    (req, res) =>
      validators.returnValidationResults(
        req,
        res,
        configurationController.CreateConfiguration
      )
  );

  app.get(
    "/configuration",
    authenticationHelper.EnsureAuthenticated(),
    configurationController.GetConfiguration
  );
  app.patch(
    "/configuration",
    validators.validateUpdateConfiguration,
    (req, res) =>
      validators.returnValidationResults(
        req,
        res,
        configurationController.UpdateConfiguration
      )
  );

  app.post(
    "/notifications",
    authenticationHelper.EnsureAuthenticated(),
    notificationController.UpdateNotifications
  );

  app.get(
    "/notificationdashboard",
    authenticationHelper.EnsureAuthenticated(),
    notificationController.GetNotificationDashboard
  );

  //TODO: add the input validation, for dates (startDate/endDate)
  app.get(
    "/calendar",
    authenticationHelper.EnsureAuthenticated(),
    calendarController.GetCalendar
  );
};
