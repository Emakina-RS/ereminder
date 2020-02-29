'use string'

const constants = require('../config/constants');
const dateTimeHelper = require('./dateTimeHelper');
const encryptionHelper = require('./encryptionHelper');
const ical = require('ical-generator');
const configurationService = require('../services/configurationService');
const moment = require('moment');

exports.getNotificationCalendarData = async function(configuration, notifications, removedCalendar, updatedConfig) {

    removedCalendar = true;
    if(!configuration.enableCalendarNotification && !removedCalendar) return null;

    if(!configuration.enableCalendarNotification && removedCalendar) return getFileCalendarData(configuration, notifications, 'cancel');

    if(configuration.enableCalendarNotification && updatedConfig) return getFileCalendarData(configuration, notifications, 'refresh');

    return getFileCalendarData(configuration, notifications, 'add');

}

async function getFileCalendarData(configuration, notifications, method) {

    let calendarId = await encryptionHelper.Encrypt(configuration.User.createdAt.toString());

    const cal = ical({
        domain: 'reminder.com',
        prodId: {company: 'ereminder.com', product: 'ereminder'},
        name: 'E-reminder',
        timezone: 'Europe/Belgrade',
        method: method
    });

    for(let i=0; i < notifications.length; i++) { 
        let lastTimeInitConfiguration = await configurationService.GetLastTimeConfiguration(
            notifications[i].NotificationTypeId,
            configuration
        );
        let beginTime = moment(lastTimeInitConfiguration).add(notifications[i].intervalHours, 'hours').utc()
        let event =  cal.createEvent({
            uid: calendarId + notifications[i].IntervalId,
            summary : constants.NotificationsCalendarTitles[notifications[i].IntervalId],
            start: beginTime,
            end: beginTime.add(20, 'minutes'),
            timestamp: beginTime
        });
        event.repeating(constants.NotificationIntervalRepeating[notifications[i].IntervalId]);
    }
    return cal.toString();
}
