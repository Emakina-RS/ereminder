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

exports.updateNotifications = async function (notifications, userId) {
  return await notifications.forEach(async notification => {
    await makeNotification(notification, userId);
  });
};

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
  nt.Id as 'notificationsId'  FROM notifications n
  INNER JOIN intervals i ON n.IntervalId = i.Id
  INNER JOIN users u ON n.UserId = u.Id
  INNER JOIN notificationtypes nt ON n.NotificationTypeId = nt.Id
  INNER JOIN configurations conf ON n.UserId = conf.UserId;`;

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
      return constants.emailTemplates.referralEmail;;
    case 5:
      return constants.emailTemplates.medicalFindingsEmail;;
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
      intervals: notificationType.intervals.map(interval => {
        return {
          id: interval.id,
          displayName: interval.displayName,
          checked: false
        };
      }),
      key: constants.NotificationTypeDictionary[notificationType.id],
      notificationTypeId: notificationType.id,
      notificationTypeDisplay: notificationType.value,
      checked: false
    };
  });

  if (!usersConfiguration.length) {
    return allConfiguration;
  }

  usersConfiguration.forEach(config => {
    updateMatchingConfiguration(allConfiguration, config);
  });

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
  array.forEach(item => {
    if (item.notificationTypeId === config.NotificationTypeId) {
      let checked = false;
      item.intervals.forEach(interval => {
        if (interval.id === config.Interval.id) {
          interval.checked = true;
          checked = true;
        }
      });
      if (checked) {
        item.checked = true;
        item.notificationId = config.id;
        item.intervalId = config.Interval.id;
      }
    }
  });
}

const arrayToObject = (array, keyField) =>
  array.reduce((obj, item) => {
    obj[item[keyField]] = item;
    return obj;
  }, {});

async function makeNotification(notification, userId) {
  if (isCreateNotification(notification))
    return await createNotification(notification, userId);

  if (isUpdateNotification(notification))
    return await updateNotification(notification);

  if (isDeleteNotification(notification))
    return await deleteNotification(notification);
}

/**
 * This function creates a new notification
 * @param {Object} notification 
 * @param {Boolean} userId 
 */
async function createNotification(notification, userId) {
  const { notificationTypeId, notificationIntervalId } = notification;

  //before creating we always check if the user already has an existing notification of that type
  return await models.Notification.findOrCreate({
    where: {
      UserId: userId,
      NotificationTypeId: notificationTypeId
    },
    defaults: {
      UserId: userId,
      NotificationTypeId: notificationTypeId,
      IntervalId: notificationIntervalId
    }
  });
}

async function updateNotification(notification) {
  const {
    notificationId,
    notificationTypeId,
    notificationIntervalId
  } = notification;
  return await models.Notification.findByPk(notificationId).then(
    notification => {
      if (notification) {
        notification.update({
          NotificationTypeId: notificationTypeId,
          IntervalId: notificationIntervalId
        });
      }
    }
  );
}

async function deleteNotification(notification) {
  const { notificationId } = notification;
  return await models.Notification.findByPk(notificationId).then(
    notification => {
      if (notification) notification.destroy();
    }
  );
}

function isCreateNotification(notification) {
  const {
    notificationId,
    notificationTypeId,
    notificationIntervalId
  } = notification;
  return notificationTypeId && notificationIntervalId && !notificationId;
}

function isUpdateNotification(notification) {
  const {
    notificationId,
    notificationTypeId,
    notificationIntervalId
  } = notification;
  return notificationTypeId && notificationIntervalId && notificationId;
}

function isDeleteNotification(notification) {
  const {
    notificationId,
    notificationTypeId,
    notificationIntervalId
  } = notification;
  return notificationId && !notificationTypeId && !notificationIntervalId;
}
