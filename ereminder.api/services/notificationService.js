"use strict";

const models = require("../models");
const constants = require("../config/constants");
const mailer = require("../core/mailer");
const configurationService = require("../services/configurationService");
require("../config/config");
const mailSubjects = global.globalConfig.mailSubjects;
const logger = require("../startup/logger")();
const moment = require("moment");
require("moment-recur");

const siteUrls = global.globalConfig.siteUrls;

/**
 * Entry point for notification dashboard update. Iterates through notifications and handles each
 */
exports.updateNotifications = async function (notifications, userId) {
  for (const key in notifications) {
    await handleNotification(notifications[key], key, userId);
  }

  return;
};

async function handleNotification(notificationObj, notificationType, userId) {
  let notificationTypeId = getNotificationTypeId(notificationType);
  if (notificationObj.checked) {
    return await createOrUpdateNotification(notificationObj, notificationTypeId, userId);
  }
  else {
    return await deleteNotification(notificationTypeId, userId);
  }
}

/**
 * This function searches notifications by user id and type
 * if it doesn't find any match it creates a new notification, if it does find then it updates the existing
 * @param {Object} notificationObj
 * @param {String} notificationTypeId
 * @param {Boolean} userId 
 */
async function createOrUpdateNotification(notificationObj, notificationTypeId, userId) {
  let notificationIntervalId = getNotificationIntervalId(notificationObj);

  return await models.Notification.findOne({
    where: {
      UserId: userId,
      NotificationTypeId: notificationTypeId
    }
  }).then(
    notification => {
      if (notification) {
        notification.update({
          NotificationTypeId: notificationTypeId,
          IntervalId: notificationIntervalId
        });
      }
      else {
        models.Notification.create({
          UserId: userId,
          NotificationTypeId: notificationTypeId,
          IntervalId: notificationIntervalId
        });
      }
    }
  );
}

async function deleteNotification(notificationTypeId, userId) {
  return await models.Notification.findOne({
    where: {
      UserId: userId,
      NotificationTypeId: notificationTypeId
    }
  }).then(
    notification => {
      if (notification) notification.destroy();
    }
  );
}

/**
 * Returns the id (Int) of the notification type based on string value defined in constants
 * @param {String} type 
 */
function getNotificationTypeId(type) {
  let dictionary = constants.NotificationTypeDictionary;
  return Object.keys(dictionary).find(key => dictionary[key] === type);
}

function getNotificationIntervalId(notificationObj) {
  let interval = notificationObj.intervals.find(interval => interval.checked === true);
  return interval.id;
}


exports.sendEmailNotifications = async function () {
  var notifications = await getNotificationsWithAdditionalAttributes();
  notifications.forEach(async notification => {
    switch (notification.NotificationTypeId) {
      case constants.NotificationType.Medicine:
        await tookPills(notification);
        break;
      case constants.NotificationType.Recepies:
        await doRemind(notification, notification.lastTimeInPharmacy);
        break;
      case constants.NotificationType.Pharmacy:
        await doRemind(notification, notification.lastTimeGotPrescription);
        break;
      case constants.NotificationType.Referral:
        await doRemind(notification, notification.lastTimeGotReferral);
        break;
      case constants.NotificationType.MedicalFindings:
        await doRemind(notification, notification.lastTimeExamination);
        break;
    }
  });
};

exports.getNotificationDashboard = async function (userId) {
  let usersConfiguration = await getDashboardForUpdating(userId);
  return await notificationDashboard(usersConfiguration);
};

async function tookPills(notification) {
  let {
    lastTimeTookPills,
    valueInHours,
    lastTimeSent,
    Id,
    userId,
    email,
    NotificationTypeId
  } = notification;

  if (lastTimeSent) {
    let lastTime = createDateWithYearMonthDateHour(lastTimeSent);
    let currentttime = createDateWithYearMonthDateHour(new Date());
    if (lastTime.getTime() === currentttime.getTime()) return;
  }

  if (isTimeForMedicine(lastTimeTookPills, valueInHours)) {
    await doNotification(NotificationTypeId, email, Id, userId);
  }
}

async function doRemind(notification, configuredTime) {
  let {
    valueInHours,
    lastTimeSent,
    NotificationTypeId,
    email,
    Id,
    userId
  } = notification;

  if (lastTimeSent) {
    let lastTime = createDateWithYearMonthDate(lastTimeSent);
    let currentttime = createDateWithYearMonthDate(new Date());
    if (lastTime.getTime() === currentttime.getTime()) return;
  }

  if (isTimeForReminder(configuredTime, valueInHours)) {
    await doNotification(NotificationTypeId, email, Id, userId);
  }
}

async function getNotificationsWithAdditionalAttributes() {
  let sqlQuery = `SELECT n.id as 'Id', u.id as 'userId', u.email, n.lastTimeSent, i.valueInHours, n.NotificationTypeId,
  conf.lastTimeTookPills, conf.lastTimeInPharmacy, conf.lastTimeGotPrescription, conf.lastTimeGotReferral,  conf.lastTimeExamination,
  nt.Id as 'notificationsId' FROM Notifications n
    INNER JOIN Intervals i ON n.IntervalId = i.Id
    INNER JOIN Users u ON n.UserId = u.Id
    INNER JOIN NotificationTypes nt ON n.NotificationTypeId = nt.Id
    INNER JOIN Configurations conf ON n.UserId = conf.UserId
  WHERE
    conf.enableEmailNotification = 1`;

  return await models.sequelize.query(sqlQuery, {
    type: models.sequelize.QueryTypes.SELECT
  });
}

function createDateWithYearMonthDateHour(datatime) {
  return new Date(
    datatime.getFullYear(),
    datatime.getMonth(),
    datatime.getDate(),
    datatime.getHours()
  );
}

function createDateWithYearMonthDate(datatime) {
  return new Date(
    datatime.getFullYear(),
    datatime.getMonth(),
    datatime.getDate()
  );
}

function isTimeForMedicine(lastTimeTookPills, valueInHours) {
  let currentDateInHours = new Date().getHours();
  let cunfiguredDateHours = new Date(lastTimeTookPills).getHours();

  let differenceInHours = Math.abs(currentDateInHours - cunfiguredDateHours);
  let timeForMedicine = differenceInHours % valueInHours;

  return timeForMedicine === 0 ? true : false;
}

function isTimeForReminder(configuredTime, valueInHours) {
  let recurrence = moment(configuredTime)
    .recur()
    .every(valueInHours / 24)
    .days();

  if (recurrence.matches(moment(new Date()))) return true;
  return false;
}

async function doNotification(
  notificationTypeId,
  email,
  notificationId,
  userId
) {
  let emailProperties = {
    logoUrl: global.globalConfig.logoUrl,
    siteUrl: siteUrls.root
  }

  await mailer.send(getEmailNotificationHtmlBodyType(notificationTypeId), emailProperties, email);

  logger.info(
    `[NotificationService] Notification is sent to user. /n Notification Id: ${notificationId}, Notification Type : ${notificationTypeId}, User Id: ${userId}. `
  );

  await models.Notification.update(
    { lastTimeSent: new Date() },
    { where: { id: notificationId } }
  );
}

function getEmailNotificationHtmlBodyType(notificationTypeId) {
  switch (notificationTypeId) {
    case 1:
      return constants.emailTemplates.medicineEmail;
    case 2:
      return constants.emailTemplates.recepieEmail;
    case 3:
      return constants.emailTemplates.pharmacyEmail;
    case 4:
      return constants.emailTemplates.referralEmail;
    case 5:
      return constants.emailTemplates.medicalFindingsEmail;
  }
}

async function getDashboardForUpdating(userID) {
  return await models.Notification.findAll({
    where: { UserId: userID },
    include: [
      {
        model: models.Interval,
        attributes: ["id"],
        as: "Interval",
        required: true
      }
    ]
  });
}

async function notificationDashboard(usersConfiguration) {
  let allConfiguration = await getAllConfiguration();
  allConfiguration = allConfiguration.map(function (notificationType) {
    return {
      checked: false,
      key: constants.NotificationTypeDictionary[notificationType.id],
      notificationTypeDisplay: notificationType.value,
      intervals: notificationType.intervals.map(interval => {
        return {
          id: interval.id,
          displayName: interval.displayName,
          checked: false
        };
      })
    };
  });

  if (usersConfiguration.length) {
    usersConfiguration.forEach(config => {
      updateMatchingConfiguration(allConfiguration, config);
    });
  }

  return arrayToObject(allConfiguration, "key");
}

async function getAllConfiguration() {
  return await models.NotificationType.findAll({
    include: [
      {
        model: models.Interval,
        attributes: ["id", "displayName"],
        as: "intervals",
        required: true
      }
    ]
  });
}

function updateMatchingConfiguration(array, config) {
  let configNotificationType = constants.NotificationTypeDictionary[config.NotificationTypeId];
  
  array.forEach(item => {
    if (item.key === configNotificationType) {
      let checked = false;
      item.intervals.forEach(interval => {
        if (interval.id === config.Interval.id) {
          interval.checked = true;
          checked = true;
        }
      });
      item.checked = checked;
    }
  });
}

const arrayToObject = (array, keyField) =>
  array.reduce((obj, item) => {
    obj[item[keyField]] = item;
    return obj;
  }, {});