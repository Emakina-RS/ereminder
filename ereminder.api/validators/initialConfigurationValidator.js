const { body } = require('express-validator/check')
const constants = require('../config/constants');

exports.validateConfigInitialization = () => {
    return [
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

    ];
}