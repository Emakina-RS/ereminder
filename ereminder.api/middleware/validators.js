const constants = require("../config/constants");
const { body, param, validationResult } = require("express-validator");
const authentication = require("./authentication");
const moment = require("moment");
const rateLimiters = require("./rateLimiters");
const configurationService = require("../services/configurationService");

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
      if (value !== req.body.confirmPassword) {
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
    .custom((value, { req }) => {
      if (value) {
        if (!validateDateTime(value)) {
          throw new Error(constants.errorMessages.validateDate);
        }
        if (isInputDateInFuture(value)) {
          throw new Error(constants.errorDataTime.dataTimeInFuture);
        }
      }
      return true;
    }),
  body("lastTimeInPharmacy")
    .custom((value, { req }) => {
      if (value) {
        if (!validateDate(value)) {
          throw new Error(constants.errorMessages.validateDate);
        }
        if (isInputDateInFuture(value)) {
          throw new Error(constants.errorDataTime.dataTimeInFuture);
        }
      }
      return true;
    }),
  body("lastTimeGotPrescription")
    .custom((value, { req }) => {
      if (value) {
        if (!validateDate(value)) {
          throw new Error(constants.errorMessages.validateDate);
        }
        if (isInputDateInFuture(value)) {
          throw new Error(constants.errorDataTime.dataTimeInFuture);
        }
      }
      return true;
    }),
  body("lastTimeGotReferral")
    .custom((value, { req }) => {
      if (value) {
        if (!validateDate(value)) {
          throw new Error(constants.errorMessages.validateDate);
        }
        if (isInputDateInFuture(value)) {
          throw new Error(constants.errorDataTime.dataTimeInFuture);
        }
      }
      return true;
    }),
  body("lastTimeExamination")
    .custom((value, { req }) => {
      if (value) {
        if (!validateDate(value)) {
          throw new Error(constants.errorMessages.validateDate);
        }
        if (isInputDateInFuture(value)) {
          throw new Error(constants.errorDataTime.dataTimeInFuture);
        }
      }
      return true;
    })
];

exports.updateConfiguration = [
  authentication.EnsureAuthenticated(),
  body("lastTimeTookPills")
    .optional({ options: { nullable: true } })
    .custom((value, { req }) => {
      if (value) {
        if (!validateDateTime(value)) {
          throw new Error(constants.errorMessages.validateDate);
        }
        if (isInputDateInFuture(value)) {
          throw new Error(constants.errorDataTime.dataTimeInFuture);
        }
      }
      return true;
    }),
  body("lastTimeInPharmacy")
    .optional({ options: { nullable: true } })
    .custom((value, { req }) => {
      if (value) {
        if (!validateDate(value)) {
          throw new Error(constants.errorMessages.validateDate);
        }
        if (isInputDateInFuture(value)) {
          throw new Error(constants.errorDataTime.dataTimeInFuture);
        }
      }
      return true;
    }),
  body("lastTimeGotPrescription")
    .optional({ options: { nullable: true } })
    .custom((value, { req }) => {
      if (value) {
        if (!validateDate(value)) {
          throw new Error(constants.errorMessages.validateDate);
        }
        if (isInputDateInFuture(value)) {
          throw new Error(constants.errorDataTime.dataTimeInFuture);
        }
      }
      return true;
    }),
  body("lastTimeGotReferral")
    .optional({ options: { nullable: true } })
    .custom((value, { req }) => {
      if (value) {
        if (!validateDate(value)) {
          throw new Error(constants.errorMessages.validateDate);
        }
        if (isInputDateInFuture(value)) {
          throw new Error(constants.errorDataTime.dataTimeInFuture);
        }
      }
      return true;
    }),
  body("lastTimeExamination")
    .optional({ options: { nullable: true } })
    .custom((value, { req }) => {
      if (value) {
        if (!validateDate(value)) {
          throw new Error(constants.errorMessages.validateDate);
        }
        if (isInputDateInFuture(value)) {
          throw new Error(constants.errorDataTime.dataTimeInFuture);
        }
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
  body("medicalFindings")
    .custom(async (value, { req }) => {
		if(value) {
			let user = await getUserConfiguration(req);
			// check if date is configured for this field
			if (value.checked && !user.lastTimeExamination) {
			  throw new Error(constants.invalidFieldValue.dateIsNotSetInDB);
			}
		}

      return true;
    }),
  body("medicine")
    .custom(async (value, { req }) => {
      if(value) {
		let user = await getUserConfiguration(req);
		// check if date is configured for this field
		if (value.checked && !user.lastTimeTookPills) {
			throw new Error(constants.invalidFieldValue.dateIsNotSetInDB);
		}
	}
      return true;
    }),
  body("pharmacy")
    .custom(async (value, { req }) => {
		if(value) {
			let user = await getUserConfiguration(req);
			// check if date is configured for this field
			if (value.checked && !user.lastTimeInPharmacy) {
			  throw new Error(constants.invalidFieldValue.dateIsNotSetInDB);
			}
		}

      return true;
    }),
  body("recepies")
    .custom(async (value, { req }) => {
		if(value) {
			let user = await getUserConfiguration(req);
			// check if date is configured for this field
			if (value.checked && !user.lastTimeGotPrescription) {
			  throw new Error(constants.invalidFieldValue.dateIsNotSetInDB);
			}
		}
     
      return true;
    }),
  body("referral")
    .custom(async (value, { req }) => {
		if(value) {
			let user = await getUserConfiguration(req);
			// check if date is configured for this field
			if (value.checked && !user.lastTimeGotReferral) {
			  throw new Error(constants.invalidFieldValue.dateIsNotSetInDB);
			}
		}
     
      return true;
    })
];

exports.calendar = [
  authentication.EnsureAuthenticated(),
  param("startdate")
    .exists()
    .withMessage(constants.errorMessages.requiredField("startdate"))
    .custom((value, { req }) => {
      if (!validateDate(value)) {
        throw new Error(constants.errorMessages.validateDate);
      }
      return true;
    }),
  param("enddate")
    .exists()
    .withMessage(constants.errorMessages.requiredField("enddate"))
    .custom((value, { req }) => {
      if (!validateDate(value)) {
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

function isInputDateInFuture(date) {
  let dateFromInput = new Date(date);
  let currentDate = new Date();

  if (currentDate <= dateFromInput) return true;
  return false;
}

async function getUserConfiguration(req) {
  return await configurationService.GetConfiguration(req.user.id);
}