"use strict";

const models = require("../models");
const constants = require("../config/constants");
const dateTimeHelper = require("../helpers/dateTimeHelper");

exports.CreateConfiguration = async function(body, userId) {
  let configuration = createDBConfiguration(body);
  configuration.UserId = userId;
  return await createInitialConfiguration(configuration);
};

exports.UpdateConfiguration = async function(body, userId) {
  let configuration = createDBConfiguration(body);
  return await updateInitialConfiguration(configuration, userId);
};

exports.GetConfiguration = async function(userId) {
  return await models.InitialConfiguration.findOne({
    where: { UserId: userId }
  });
};

exports.GetLastTimeConfiguration = async function(
  notificationTypeId,
  initialConfiguration
) {
  let lastTimeInitConfiguration;

  switch (notificationTypeId) {
    case constants.NotificationType.Recepies:
      lastTimeInitConfiguration = new Date(
        initialConfiguration.lastTimeGotPrescription
      );
      break;
    case constants.NotificationType.Pharmacy:
      lastTimeInitConfiguration = new Date(
        initialConfiguration.lastTimeInPharmacy
      );
      break;
    case constants.NotificationType.Referral:
      lastTimeInitConfiguration = new Date(
        initialConfiguration.lastTimeGoReferral
      );
      break;
    case constants.NotificationType.MedicalFindings:
      lastTimeInitConfiguration = new Date(
        initialConfiguration.lastTimeExamination
      );
      break;
  }

  return lastTimeInitConfiguration;
};

function createDBConfiguration(body) {
  var dbConfiguraton = {};

  tryAddDateTimeToConfiguration(
    "lastTimeTookPills",
    body.lastTimeTookPills,
    dbConfiguraton
  );

  tryAddDateTimeToConfiguration(
    "lastTimeInPharmacy",
    body.lastTimeInPharmacy,
    dbConfiguraton
  );

  tryAddDateTimeToConfiguration(
    "lastTimeGotPrescription",
    body.lastTimeGotPrescription,
    dbConfiguraton
  );

  tryAddDateTimeToConfiguration(
    "lastTimeGotReferral",
    body.lastTimeGotReferral,
    dbConfiguraton
  );

  tryAddDateTimeToConfiguration(
    "lastTimeExamination",
    body.lastTimeExamination,
    dbConfiguraton
  );

  tryAddNotificationToConfiguration(
    "enableEmailNotification",
    body.enableEmailNotification,
    dbConfiguraton
  );

  tryAddNotificationToConfiguration(
    "enableCalendarNotification",
    body.enableCalendarNotification,
    dbConfiguraton
  );

  return dbConfiguraton;
}

function tryAddDateTimeToConfiguration(name, value, dbConfiguraton) {
  if (value) {
    dbConfiguraton[name] = dateTimeHelper.convertToUCTDateTime(value);
  }
}

function tryAddNotificationToConfiguration(name, value, dbConfiguraton) {
  if (value !== undefined) {
    dbConfiguraton[name] = value;
  }
}

async function updateInitialConfiguration(configuration, userId) {
  return await models.InitialConfiguration.update(configuration, {
    where: { UserId: userId },
    returning: true
  }).then(newConfig => {
    return newConfig;
  });
}

async function createInitialConfiguration(configuration) {
  return await models.InitialConfiguration.create(configuration).then(
    newConfig => {
      return newConfig;
    }
  );
}
