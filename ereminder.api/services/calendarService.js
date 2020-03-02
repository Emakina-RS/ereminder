"use strict";

const models = require("../models");
const constants = require("../config/constants");
const dateformat = require("dateformat");
const moment = require("moment");
const calendarFileHelper = require('../helpers/calendarFileHelper');
const configurationService = require("./configurationService");
require("moment-recur");

exports.getCalendar = async function(userId, startDate, endDate, calendarFileAction) {

  let configuration = await  models.Configuration.findOne({
    where: { UserId: userId },
    include: [
      {
        model: models.User,
        attributes: ["createdAt", "email"],
        as: "User",
        required: true
      }
    ]
  });

  let notifications = await models.sequelize.query(
    `SELECT n.NotificationTypeId,
            n.IntervalId,
            nt.value as 'notificationType',
            i.displayName, i.valueInHours as 'intervalHours'
            FROM Notifications n
                    INNER JOIN Users u ON n.UserId = u.Id
                    INNER JOIN NotificationTypes nt ON n.NotificationTypeId = nt.Id
                    INNER JOIN Intervals i ON n.IntervalId = i.Id
                WHERE u.Id = ${userId}`,
    {
      type: models.sequelize.QueryTypes.SELECT
    }
  );

  let calendar = {
    takeRecepieEveryHours: null,
    reminders: {}
  };

  calendar.calendarFileData = await calendarFileHelper.getNotificationCalendarData(configuration, notifications, calendarFileAction);

  for (let i = 0; i < notifications.length; i++) {
    let notification = notifications[i];
    let loopDate = new Date(startDate);

    if (notification.NotificationTypeId === constants.NotificationType.Medicine) {
      calendar.takeRecepieEveryHours = notification.intervalHours;
      continue;
    }

    let lastTimeInitConfiguration = await configurationService.GetLastTimeConfiguration(
      notification.NotificationTypeId,
      configuration
    );

    let numberOfMonths = Math.round(notification.intervalHours / 24 / 30);
    let recurrence = moment.utc(lastTimeInitConfiguration)
      .recur()
      .every(numberOfMonths)
      .months();

    do {
      let utcLoopData = moment.utc(loopDate);

      if (recurrence.matches(utcLoopData)) {
        appendNotification(
          calendar,
          loopDate,
          notification.notificationType,
          notification.NotificationTypeId
        );
      }

      let newDate = loopDate.setDate(loopDate.getDate() + 1);
      loopDate = new Date(newDate);
    } while (loopDate <= endDate);
  }

  return calendar;
};

function appendNotification(
  calendar,
  date,
  notificationTypeName,
  notificationTypeId
) {
  let dateKey = dateformat(date, "yyyy/mm/dd");
  let calendarDate = calendar.reminders[dateKey];

  if (!calendarDate) {
    calendarDate = new Array();
    calendar.reminders[dateKey] = calendarDate;
  }

  calendarDate.push({
    notificationTypeName: notificationTypeName,
    notificationTypeId: notificationTypeId
  });
}
