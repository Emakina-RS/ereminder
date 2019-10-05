const constants = require('../config/constants');
const { body, validationResult } = require('express-validator');

exports.validateRegister = [

    body('email')
    .exists()
    .withMessage(constants.errorMessages.requiredField('Email'))
    .isEmail().withMessage(constants.errorMessages.invalidEmail),
    body('password')
    .exists()
    .withMessage(constants.errorMessages.requiredField('Password')),
    body('confirm_password')
    .exists()
    .withMessage(constants.errorMessages.requiredField('Confirm password'))
    .matches('password')
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


exports.returnValidationResults = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    return next(req, res);
}