'use string'

const constants = require('../constants');
const momentTZ = require('moment-timezone');
exports.GetNotificationCalendarData = function(notification) {

    let date = new Date();
    let beginTime = notification.start;
    var a = momentTZ .tz(notification.start, constants.timeZone);

    return {
        subject : constants.NotificationsEmailTitles[notification.notificationTypeId],
        description : constants.NotificationsEmailDescription[notification.notificationTypeId],
        beginTime: beginTime,
        rrule = NotificationIntervalRRULE[notification.notificationTypeId]

    }

}

