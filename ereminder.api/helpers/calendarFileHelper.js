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

    return getFileCalendarData(configuration, notifications, methods.PUBLISH);

}

async function getFileCalendarData(configuration, notifications, method) {

    let calendarId = await encryptionHelper.MD5(configuration.User.createdAt.toString() + configuration.User.Id);
    const cal = ical({
        domain: 'reminder.com',
        prodId: {company: 'ereminder.com', product: 'ereminder'},
        name: 'E-reminder',
        method: method,
    });

    cal.x('X-WR-RELCALID', calendarId);

    for (let key in constants.NotificationTypeDictionary) {
        let notificationTypeId = Number(key);

        let notification = notifications.find(notification => notification.NotificationTypeId == notificationTypeId);

        await addEvent(calendarId, cal, notification, notificationTypeId, configuration, method);
        if(notificationTypeId !== constants.NotificationType.Medicine) continue;

        if(notification && notification.IntervalId == constants.NotificationInterval.TwelveHours) {
            await addEvent(calendarId, cal, notification, notificationTypeId, configuration, method, 12);
            continue;
        }
        await addEvent(calendarId, cal, notification, notificationTypeId, configuration, methods.CANCEL, 12);

    }

    return cal.toString();
}


async function addEvent(calendarId, cal, notification, notificationTypeId, configuration, method, hoursToAdd) {

    let lastTimeInitConfiguration = await configurationService.GetLastTimeConfiguration(
        notificationTypeId,
        configuration
    );
    let beginTime = notification ? moment(lastTimeInitConfiguration).add(notification.intervalHours, 'hours').utc() : moment();

    if(hoursToAdd){
        beginTime.add(hoursToAdd, 'hours');
        calendarId = calendarId + hoursToAdd;
    }
    let event =  cal.createEvent({
        uid: calendarId + notificationTypeId,
        summary : constants.NotificationsCalendarTitles[notificationTypeId],
        start: beginTime,
        sequence: 1,
        end: beginTime.add(20, 'minutes'),
        timestamp: moment()
    });

    event.status(method === methods.CANCEL || !notification ? 'cancelled' : 'confirmed');
    event.createAttendee({email: configuration.User.email});

    if(notification) {
        event.repeating(constants.NotificationIntervalRepeating[notification.IntervalId]);
    }
    return event;
}