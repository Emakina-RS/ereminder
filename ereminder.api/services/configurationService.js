"use strict";

const models = require("../models");
const constants = require("../config/constants");
const dateTimeHelper = require("../helpers/dateTimeHelper");

exports.CreateConfiguration = async function(body, userId) {
  let configuration = createDBConfiguration(body);
  configuration.UserId = userId;
  return await createConfiguration(configuration);
};

exports.UpdateConfiguration = async function(body, userId) {
  let configuration = createDBConfiguration(body);
  return await updateConfiguration(configuration, userId);
};

exports.GetConfiguration = async function(userId) {
  return await models.Configuration.findOne({
    where: { UserId: userId }
  });
};

exports.GetLastTimeConfiguration = async function(
  notificationTypeId,
  configuration
) {
  switch (notificationTypeId) {
    case constants.NotificationType.Medicine:
      return new Date(configuration.lastTimeTookPills);
      break;
    case constants.NotificationType.Recepies:
      return new Date(configuration.lastTimeGotPrescription);
      break;
    case constants.NotificationType.Pharmacy:
      return new Date(configuration.lastTimeInPharmacy);
      break;
    case constants.NotificationType.Referral:
      return new Date(configuration.lastTimeGoReferral);
      break;
    case constants.NotificationType.MedicalFindings:
      return new Date(configuration.lastTimeExamination);
      break;
    default:
      return null;
  }
};

function createDBConfiguration(body) {
  var dbConfiguraton = {};

  tryAddDateTimeToConfiguration(
    "lastTimeTookPills",
    body.lastTimeTookPills,
    dbConfiguraton
  );

  tryAddDateToConfiguration(
    "lastTimeInPharmacy",
    body.lastTimeInPharmacy,
    dbConfiguraton
  );

  tryAddDateToConfiguration(
    "lastTimeGotPrescription",
    body.lastTimeGotPrescription,
    dbConfiguraton
  );

  tryAddDateToConfiguration(
    "lastTimeGotReferral",
    body.lastTimeGotReferral,
    dbConfiguraton
  );

  tryAddDateToConfiguration(
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

function tryAddDateToConfiguration(name, value, dbConfiguraton) {
  if (value) {
    dbConfiguraton[name] = dateTimeHelper.convertToUCTDate(value);
  }
}

function tryAddNotificationToConfiguration(name, value, dbConfiguraton) {
  if (value !== undefined) {
    dbConfiguraton[name] = value;
  }
}

async function updateConfiguration(configuration, userId) {
  return await models.Configuration.update(configuration, {
    where: { UserId: userId },
    returning: true
  }).then(newConfig => {
    return newConfig;
  });
}

async function createConfiguration(configuration) {
  return await models.Configuration.create(configuration).then(newConfig => {
    return newConfig;
  });
}
