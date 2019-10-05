const constants = require('../config/constants');
const { body, validationResult } = require('express-validator');
const authenticationHelper = require('../helpers/AuthenticationHelper');

exports.validateRegister = [
    body('email')
    .exists()
    .withMessage(constants.errorMessages.requiredField('Email'))
    .isEmail().withMessage(constants.errorMessages.invalidEmail),
    body('password')
    .exists()
    .withMessage(constants.errorMessages.requiredField('Password'))
    .custom((value,{req}) => {
        if (value !== req.body.confirmpassword) {
            throw new Error(constants.errorMessages.unmatchedPassword);
        } else {
            return value;
        }
    })
    .withMessage(constants.errorMessages.unmatchedPassword)
];

exports.validateResetPassword = [
    body('password')
    .exists()
    .withMessage(constants.errorMessages.requiredField('Password')),
    body('confirm_password')
    .exists()
    .withMessage(constants.errorMessages.requiredField('Confirm password'))
    .matches('password')
    .withMessage(constants.errorMessages.unmatchedPassword)
];

exports.validateForgotPassword = [
    body('email')
    .exists()
    .withMessage(constants.errorMessages.requiredField('Email'))
    .isEmail().withMessage(constants.errorMessages.invalidEmail)
];

exports.validateLogin = [
    body('username')
    .exists()
    .withMessage(constants.errorMessages.requiredField('Email'))
    .isEmail().withMessage(constants.errorMessages.invalidEmail),
    body('password')
    .exists()
    .withMessage(constants.errorMessages.requiredField('Password'))
];

exports.validateConfigInitialization = [
    authenticationHelper.EnsureAuthenticated(),
    body('lastTimeTookPills')
    .exists()
    .withMessage(constants.errorMessages.requiredField)
    .isISO8601(constants.stringFormats.dateTime)
    .withMessage(constants.errorMessages.futureDate)
    .isAfter()
    .withMessage(constants.errorMessages.invalidDateTime),

    body('lastTimeInPharmacy')
    .exists()
    .withMessage(constants.errorMessages.requiredField)
    .isISO8601(constants.stringFormats.date)
    .withMessage(constants.errorMessages.futureDate)
    .isAfter()
    .withMessage(constants.errorMessages.invalidDate),

    body('lastTimeGotPrescription')
    .exists()
    .withMessage(constants.errorMessages.requiredField)
    .isISO8601(constants.stringFormats.date)
    .withMessage(constants.errorMessages.futureDate)
    .isAfter()
    .withMessage(constants.errorMessages.invalidDate),

    body('lastTimeGotReferral')
    .exists()
    .withMessage(constants.errorMessages.requiredField)
    .isISO8601(constants.stringFormats.date)
    .withMessage(constants.errorMessages.futureDate)
    .isAfter()
    .withMessage(constants.errorMessages.invalidDate),

    body('lastTimeExamination')
    .exists()
    .withMessage(constants.errorMessages.requiredField)
    .isISO8601(constants.stringFormats.date)
    .withMessage(constants.errorMessages.futureDate)
    .isAfter()
    .withMessage(constants.errorMessages.invalidDate)
]

exports.returnValidationResults = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    return next(req, res);
}