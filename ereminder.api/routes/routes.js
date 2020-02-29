"use strict";

require("express-async-errors");
const authenticationController = require("../controllers/AuthenticationController");
const accountController = require("../controllers/AccountController");
const notificationController = require("../controllers/NotificationController");
const calendarController = require("../controllers/CalendarController");
const configurationController = require("../controllers/ConfigurationController");
const authentication = require("../middleware/authentication");
const validators = require("../middleware/validators");

module.exports = function(app) {
  app.post("/authenticate", validators.authenticate, (req, res) =>
    validators.returnValidationResults(
      req,
      res,
      authenticationController.Authenticate
    )
  );

  app.post("/token", validators.refreshToken, (req, res) =>
    validators.returnValidationResults(
      req,
      res,
      authenticationController.RefreshToken
    )
  );

  app.post("/register", validators.register, (req, res) =>
    validators.returnValidationResults(req, res, accountController.Register)
  );

  app.post(
    "/confirmregistration",
    validators.registerConfirmation,
    (req, res) =>
      validators.returnValidationResults(
        req,
        res,
        accountController.RegisterConfirmation
      )
  );

  app.post("/resetpassword", validators.resetPassword, (req, res) =>
    validators.returnValidationResults(
      req,
      res,
      accountController.ResetPassword
    )
  );

  app.post("/forgotpassword", validators.forgotPassword, (req, res) =>
    validators.returnValidationResults(
      req,
      res,
      accountController.ForgotPassword
    )
  );

  app.post("/configuration", validators.configInitialization, (req, res) =>
    validators.returnValidationResults(
      req,
      res,
      configurationController.CreateConfiguration
    )
  );

  app.get(
    "/configuration",
    authentication.EnsureAuthenticated(),
    configurationController.GetConfiguration
  );
  app.patch("/configuration", validators.updateConfiguration, (req, res) =>
    validators.returnValidationResults(
      req,
      res,
      configurationController.UpdateConfiguration
    )
  );

  app.post("/notifications", validators.notifications, (req, res) =>
    validators.returnValidationResults(
      req,
      res,
      notificationController.UpdateNotifications
    )
  );

  app.get(
    "/notificationdashboard",
    authentication.EnsureAuthenticated(),
    notificationController.GetNotificationDashboard
  );

  app.get("/calendar/startdate/:startdate/enddate/:enddate", validators.calendar, (req, res) =>
    validators.returnValidationResults(req, res, calendarController.GetCalendar)
  );
};
