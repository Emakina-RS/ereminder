'use strict'

const models = require('../models');
const constants = require('../config/constants');
const userValidator = require('../validators/userValidator.js');

exports.CreateConfiguration = async function (body, userId) {
    //TODO: implement this validation out of this service method (middleware)
    let configuration = {
         lastTimeTookPills: userValidator.convertToUCTDateTime(body.lastTimeTookPills),
         lastTimeInPharmacy: userValidator.convertToUCTDate(body.lastTimeInPharmacy),
         lastTimeGotPrescription: userValidator.convertToUCTDate(body.lastTimeGotPrescription),
         lastTimeGotReferral: userValidator.convertToUCTDate(body.lastTimeGotReferral),
         lastTimeExamination: userValidator.convertToUCTDate(body.lastTimeExamination),
    }

    let userConfig = await models.InitialConfiguration.findAll({
         include: [{
              model: models.User,
              where: { id: userId }
         }]
    });

    if(userConfig.length) {
         return await models.InitialConfiguration.update(configuration, {
              where: { id: userConfig[0].id },
              returning: true
          })
         .then((newConfig) => { return newConfig; });
    }

    configuration.UserId = userId;

    return await models.InitialConfiguration
        .create(configuration)
        .then((newConfig) => { return newConfig; });
}

exports.GetConfiguration = async function (userId) {
    var query = {
        where: {id: userId},
        include: [
          {model: models.InitialConfiguration, as: 'InitialConfiguration'}
        ]
      }

    return await models.User.findOne(query).
        then(function (user) {
            return user.InitialConfiguration
    });
};

exports.UpdateConfiguration = async function(userId, configuration) {
    await models.InitialConfiguration.update(configuration, {
        where: { id: userId }
    });
}

exports.GetLastTimeConfiguration = async function(notificationTypeId, initialConfiguration) {
    let lastTimeInitConfiguration;

    switch (notificationTypeId) {
        case constants.NotificationType.Recepies:
            lastTimeInitConfiguration = new Date(initialConfiguration.lastTimeGotPrescription);
            break;
        case constants.NotificationType.Pharmacy:
            lastTimeInitConfiguration = new Date(initialConfiguration.lastTimeInPharmacy);
            break;
        case constants.NotificationType.Referral:
            lastTimeInitConfiguration = new Date(initialConfiguration.lastTimeGoReferral);
            break;
        case constants.NotificationType.MedicalFindings:
            lastTimeInitConfiguration = new Date(initialConfiguration.lastTimeExamination);
            break;
    }

    return lastTimeInitConfiguration;
}