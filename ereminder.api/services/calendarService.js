"use strict";

const models = require("../models");
const constants = require("../config/constants");
const dateformat = require("dateformat");
const moment = require("moment");
const configurationService = require("./configurationService");
require("moment-recur");

exports.getCalendar = async function(userId, startDate, endDate) {
  let initialConfiguration = await models.InitialConfiguration.findOne({
    UserId: userId
  });

  let notifications = await models.sequelize.query(
    `SELECT n.NotificationTypeId, nt.value as 'notificationType', i.displayName, i.valueInHours as 'intervalHours'  FROM notifications n
                    INNER JOIN users u ON n.UserId = u.Id
                    INNER JOIN notificationtypes nt ON n.NotificationTypeId = nt.Id
                    INNER JOIN intervals i ON n.IntervalId = i.Id
                WHERE u.Id = ${userId}`,
    {
      type: models.sequelize.QueryTypes.SELECT
    }
  );

  let calendar = {
    takeRecepieEveryHours: null,
    reminders: {}
  };

  for (let i = 0; i < notifications.length; i++) {
    let notification = notifications[i];
    let loopDate = new Date(startDate);

    if (
      notification.NotificationTypeId === constants.NotificationType.Medicine
    ) {
      calendar.takeRecepieEveryHours = notification.intervalHours;
      continue;
    }

    let lastTimeInitConfiguration = await configurationService.GetLastTimeConfiguration(
      notification.NotificationTypeId,
      initialConfiguration
    );
    let recurrence = moment(lastTimeInitConfiguration)
      .recur()
      .every(notification.intervalHours / 24)
      .days();

    do {
      if (recurrence.matches(loopDate)) {
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
