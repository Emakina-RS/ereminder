const constants = require("../config/constants");
const { body, validationResult } = require("express-validator");
const authentication = require("./authentication");
const moment = require("moment");
const rateLimiters = require("./rateLimiters");

exports.register = [
  rateLimiters.AccountCreationLimiter,
  body("email")
    .exists()
    .withMessage(constants.errorMessages.requiredField("Email"))
    .isEmail()
    .withMessage(constants.errorMessages.invalidEmail),
  body("password")
    .exists()
    .withMessage(constants.errorMessages.requiredField("Password"))
    .custom((value, { req }) => {
      if (value.length < 6) {
        throw new Error(constants.passwordError.tooShort);
      }
      if (value !== req.body.confirmpassword) {
        throw new Error(constants.errorMessages.unmatchedPassword);
      }
      return true;
    })
    .withMessage(constants.errorMessages.unmatchedPassword)
];

exports.registerConfirmation = [
  body("token")
    .exists()
    .withMessage(constants.errorMessages.requiredField("token"))
];

exports.resetPassword = [
  body("password")
    .exists()
    .withMessage(constants.errorMessages.requiredField("password")),
  body("confirmPassword")
    .exists()
    .withMessage(constants.errorMessages.requiredField("confirmPassword"))
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords don't match");
      }
      return true;
    })
    .withMessage(constants.errorMessages.unmatchedPassword)
];

exports.forgotPassword = [
  body("email")
    .exists()
    .withMessage(constants.errorMessages.requiredField("Email"))
    .isEmail()
    .withMessage(constants.errorMessages.invalidEmail)
];

exports.authenticate = [
  body("username")
    .exists()
    .withMessage(constants.errorMessages.requiredField("Email"))
    .isEmail()
    .withMessage(constants.errorMessages.invalidEmail),
  body("password")
    .exists()
    .withMessage(constants.errorMessages.requiredField("Password"))
];

exports.refreshToken = [
  body("refreshToken")
    .exists()
    .withMessage(constants.errorMessages.requiredField("refreshToken"))
];

exports.configInitialization = [
  authentication.EnsureAuthenticated(),
  body("lastTimeTookPills")
    .exists()
    .withMessage(constants.errorMessages.requiredField)
    .custom((value, { req }) => {
      if (!validateDateTime(value)) {
        throw new Error(constants.errorMessages.validateDate);
      }
      if (isInputDateInFuture(value)) {
        throw new Error(constants.errorDataTime.dataTimeInFuture);
      }
      return true;
    }),
  body("lastTimeInPharmacy")
    .exists()
    .withMessage(constants.errorMessages.requiredField)
    .custom((value, { req }) => {
      if (!validateDate(value)) {
        throw new Error(constants.errorMessages.invalidDate);
      }
      if (isInputDateInFuture(value)) {
        throw new Error(constants.errorDataTime.dataTimeInFuture);
      }
      return true;
    }),
  body("lastTimeGotPrescription")
    .exists()
    .withMessage(constants.errorMessages.requiredField)
    .custom((value, { req }) => {
      if (!validateDate(value)) {
        throw new Error(constants.errorMessages.validateDate);
      }
      if (isInputDateInFuture(value)) {
        throw new Error(constants.errorDataTime.dataTimeInFuture);
      }
      return true;
    }),
  body("lastTimeGotReferral")
    .exists()
    .withMessage(constants.errorMessages.requiredField("lastTimeGotReferral"))
    .custom((value, { req }) => {
      if (!validateDate(value)) {
        throw new Error(constants.errorMessages.validateDate);
      }
      if (isInputDateInFuture(value)) {
        throw new Error(constants.errorDataTime.dataTimeInFuture);
      }
      return true;
    }),
  body("lastTimeExamination")
    .exists()
    .withMessage(constants.errorMessages.requiredField)
    .custom((value, { req }) => {
      if (!validateDate(value)) {
        throw new Error(constants.errorMessages.validateDate);
      }
      if (isInputDateInFuture(value)) {
        throw new Error(constants.errorDataTime.dataTimeInFuture);
      }
      return true;
    })
];

exports.updateConfiguration = [
  authentication.EnsureAuthenticated(),
  body("lastTimeTookPills")
    .optional({ options: { nullable: true } })
    .custom((value, { req }) => {
      if (!validateDateTime(value)) {
        throw new Error(constants.errorMessages.validateDate);
      }
      if (isInputDateInFuture(value)) {
        throw new Error(constants.errorDataTime.dataTimeInFuture);
      }
      return true;
    }),
  body("lastTimeInPharmacy")
    .optional({ options: { nullable: true } })
    .custom((value, { req }) => {
      if (!validateDate(value)) {
        throw new Error(constants.errorMessages.invalidDate);
      }
      if (isInputDateInFuture(value)) {
        throw new Error(constants.errorDataTime.dataTimeInFuture);
      }
      return true;
    }),
  body("lastTimeGotPrescription")
    .optional({ options: { nullable: true } })
    .custom((value, { req }) => {
      if (!validateDate(value)) {
        throw new Error(constants.errorMessages.validateDate);
      }
      if (isInputDateInFuture(value)) {
        throw new Error(constants.errorDataTime.dataTimeInFuture);
      }
      return true;
    }),
  body("lastTimeGotReferral")
    .optional({ options: { nullable: true } })
    .custom((value, { req }) => {
      if (!validateDate(value)) {
        throw new Error(constants.errorMessages.validateDate);
      }
      if (isInputDateInFuture(value)) {
        throw new Error(constants.errorDataTime.dataTimeInFuture);
      }
      return true;
    }),
  body("lastTimeExamination")
    .optional({ options: { nullable: true } })
    .custom((value, { req }) => {
      if (!validateDate(value)) {
        throw new Error(constants.errorMessages.validateDate);
      }
      if (isInputDateInFuture(value)) {
        throw new Error(constants.errorDataTime.dataTimeInFuture);
      }
      return true;
    }),
  body("enableEmailNotification")
    .optional({ options: { nullable: true } })
    .custom((value, { req }) => {
      if (typeof value !== "boolean") {
        throw new Error(constants.invalidFieldValue.notBooleanField);
      }
      return true;
    }),
  body("enableCalendarNotification")
    .optional({ options: { nullable: true } })
    .custom((value, { req }) => {
      if (typeof value !== "boolean") {
        throw new Error(constants.invalidFieldValue.notBooleanField);
      }
      return true;
    })
];

exports.notifications = [
  authentication.EnsureAuthenticated(),
  body().isArray(),
  body("*.notificationTypeId", constants.invalidFieldValue.notNumberField)
    .isNumeric()
    .optional({
      options: { nullable: true }
    }),
  body("*.notificationIntervalId", constants.invalidFieldValue.notNumberField)
    .isNumeric()
    .optional({
      options: { nullable: true }
    }),
  body("*.notificationId", constants.invalidFieldValue.notNumberField)
    .isNumeric()
    .optional({
      options: { nullable: true }
    })
];

exports.calendar = [
  authentication.EnsureAuthenticated(),
  body("startDate")
    .exists()
    .withMessage(constants.errorMessages.requiredField("startDate"))
    .custom((value, { req }) => {
      if (!validateCalendarDate(value)) {
        throw new Error(constants.errorMessages.validateDate);
      }
      return true;
    }),
  body("endDate")
    .exists()
    .withMessage(constants.errorMessages.requiredField("endDate"))
    .custom((value, { req }) => {
      if (!validateCalendarDate(value)) {
        throw new Error(constants.errorMessages.validateDate);
      }
      return true;
    })
];

exports.returnValidationResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return next(req, res);
};

function validateDateTime(dateTime) {
  return moment(dateTime, constants.stringFormats.dateTime, true).isValid();
}

function validateDate(date) {
  return moment(date, constants.stringFormats.date, true).isValid();
}

function validateCalendarDate(date) {
  return moment(date, 'YYYY-MM-DD', true).isValid();
}

function isInputDateInFuture(date) {
  let dateFromInput = new Date(date);
  let currentDate = new Date();
  if (currentDate < dateFromInput) return true;
  return false;
}
