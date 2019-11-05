const constants = require("../config/constants");
const { body, validationResult } = require("express-validator");
const authenticationHelper = require("../helpers/authenticationHelper");
const moment = require("moment");

exports.validateRegister = [
  body("email")
    .exists()
    .withMessage(constants.errorMessages.requiredField("Email"))
    .isEmail()
    .withMessage(constants.errorMessages.invalidEmail),
  body("password")
    .exists()
    .withMessage(constants.errorMessages.requiredField("Password"))
    .custom((value, { req }) => {
      if (value !== req.body.confirmpassword) {
        throw new Error(constants.errorMessages.unmatchedPassword);
      }
      return true;
    })
    .withMessage(constants.errorMessages.unmatchedPassword)
];

exports.validateRegisterConfirmation = [
  body("token")
    .exists()
    .withMessage(constants.errorMessages.requiredField("token"))
];

exports.validateResetPassword = [
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

exports.validateForgotPassword = [
  body("email")
    .exists()
    .withMessage(constants.errorMessages.requiredField("Email"))
    .isEmail()
    .withMessage(constants.errorMessages.invalidEmail)
];

exports.validateLogin = [
  body("username")
    .exists()
    .withMessage(constants.errorMessages.requiredField("Email"))
    .isEmail()
    .withMessage(constants.errorMessages.invalidEmail),
  body("password")
    .exists()
    .withMessage(constants.errorMessages.requiredField("Password"))
];

exports.validateConfigInitialization = [
  authenticationHelper.EnsureAuthenticated(),
  body("lastTimeTookPills")
    .exists()
    .withMessage(constants.errorMessages.requiredField)
    .custom((value, { req }) => {
      if (!validateDateTime(value)) {
        throw new Error(constants.errorMessages.validateDate);
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
      return true;
    }),
  body("lastTimeGotPrescription")
    .exists()
    .withMessage(constants.errorMessages.requiredField)
    .custom((value, { req }) => {
      if (!validateDate(value)) {
        throw new Error(constants.errorMessages.validateDate);
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
      return true;
    }),
  body("lastTimeExamination")
    .exists()
    .withMessage(constants.errorMessages.requiredField)
    .custom((value, { req }) => {
      if (!validateDate(value)) {
        throw new Error(constants.errorMessages.validateDate);
      }
      return true;
    })
];

exports.validateUpdateConfiguration = [
  authenticationHelper.EnsureAuthenticated(),
  body("lastTimeTookPills")
    .optional({ options: { nullable: true } })
    .custom((value, { req }) => {
      if (!validateDateTime(value)) {
        throw new Error(constants.errorMessages.validateDate);
      }
      return true;
    }),
  body("lastTimeInPharmacy")
    .optional({ options: { nullable: true } })
    .custom((value, { req }) => {
      if (!validateDate(value)) {
        throw new Error(constants.errorMessages.invalidDate);
      }
      return true;
    }),
  body("lastTimeGotPrescription")
    .optional({ options: { nullable: true } })
    .custom((value, { req }) => {
      if (!validateDate(value)) {
        throw new Error(constants.errorMessages.validateDate);
      }
      return true;
    }),
  body("lastTimeGotReferral")
    .optional({ options: { nullable: true } })
    .custom((value, { req }) => {
      if (!validateDate(value)) {
        throw new Error(constants.errorMessages.validateDate);
      }
      return true;
    }),
  body("lastTimeExamination")
    .optional({ options: { nullable: true } })
    .custom((value, { req }) => {
      if (!validateDate(value)) {
        throw new Error(constants.errorMessages.validateDate);
      }
      return true;
    }),
  body("enableEmailNotification")
    .optional({ options: { nullable: true } })
    .custom((value, { req }) => {
      if (typeof value !== "boolean") {
        throw new Error("This field is not a boolean value");
      }
      return true;
    }),
  body("enableCalendarNotification")
    .optional({ options: { nullable: true } })
    .custom((value, { req }) => {
      if (typeof value !== "boolean") {
        throw new Error("This field is not a boolean value");
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
