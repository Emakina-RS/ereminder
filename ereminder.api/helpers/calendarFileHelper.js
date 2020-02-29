'use string'

const constants = require('../config/constants');
const encryptionHelper = require('./encryptionHelper');
const ical = require('ical-generator');
const configurationService = require('../services/configurationService');
const moment = require('moment');

const methods = {
    ADD:'add',
    PUBLISH:'publish',
    CANCEL:'cancel',
    REFRESH:'refresh'
}

exports.getNotificationCalendarData = async function(configuration, notifications, removedCalendar, updatedConfig) {

    if(!configuration.enableCalendarNotification && !removedCalendar) return null;

    if(!configuration.enableCalendarNotification && removedCalendar) return getFileCalendarData(configuration, notifications, methods.CANCEL);

    if(configuration.enableCalendarNotification && updatedConfig) return getFileCalendarData(configuration, notifications, methods.REFRESH);

    return getFileCalendarData(configuration, notifications, methods.ADD);

}

async function getFileCalendarData(configuration, notifications, method) {

    let calendarId = await encryptionHelper.Encrypt(configuration.User.createdAt.toString() + configuration.User.Id);

    const cal = ical({
        domain: 'reminder.com',
        prodId: {company: 'ereminder.com', product: 'ereminder'},
        name: 'E-reminder',
        timezone: 'Europe/Belgrade',
        method: method,
    });

    cal.x('X-WR-RELCALID', calendarId);

    for(let i=0; i < notifications.length; i++) {
        let lastTimeInitConfiguration = await configurationService.GetLastTimeConfiguration(
            notifications[i].NotificationTypeId,
            configuration
        );
        let beginTime = moment(lastTimeInitConfiguration).add(notifications[i].intervalHours, 'hours').utc()
        let event =  cal.createEvent({
            uid: calendarId + notifications[i].IntervalId,
            summary : constants.NotificationsCalendarTitles[notifications[i].NotificationTypeId],
            start: beginTime,
            end: beginTime.add(20, 'minutes'),
            timestamp: moment()
        });
        event.status(methods === methods.CANCEL ? 'cancelled' : 'confirmed')
        event.repeating(constants.NotificationIntervalRepeating[notifications[i].IntervalId]);
    }
    return cal.toString();
}
