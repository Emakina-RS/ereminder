const constants = require('../config/constants');
const { body } = require('express-validator/check');

exports.validateRegister = () => {
    return [
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
}

exports.validateResetPassword = () => {
    return [
        body('password')
		.exists()
		.withMessage(constants.errorMessages.requiredField('Password')),
        body('confirm_password')
        .exists()
        .withMessage(constants.errorMessages.requiredField('Confirm password'))
        .matches('password')
        .withMessage(constants.errorMessages.unmatchedPassword)
    ];
}

exports.validateForgotPassword = () => {
    return [
        body('email')
		.exists()
		.withMessage(constants.errorMessages.requiredField('Email'))
		.isEmail().withMessage(constants.errorMessages.invalidEmail)
    ];
}

exports.validateLogin = () => {
    return [
        body('email')
		.exists()
		.withMessage(constants.errorMessages.requiredField('Email'))
		.isEmail().withMessage(constants.errorMessages.invalidEmail),
        body('password')
		.exists()
		.withMessage(constants.errorMessages.requiredField('Password')),
    ];
}