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

exports.getNotificationCalendarData = async function(configuration, notifications, calendarFileAction, enableEmailNotification) {

    if(enableEmailNotification === 'false' && !calendarFileAction) return null;

    if(enableEmailNotification === 'false' && calendarFileAction === methods.CANCEL) return getFileCalendarData(configuration, notifications, methods.CANCEL);

    if(enableEmailNotification === 'true' && calendarFileAction === methods.PUBLISH) return getFileCalendarData(configuration, notifications, methods.PUBLISH);

    return null;

}

// check if the configuration dates exist for the given notification type
const isNotificationConfigurationDateEmpty = (notificationTypeID, configuration) => {
	switch(notificationTypeID) {
	  case 1:
		  if(!configuration['lastTimeTookPills']) {
			  return true;
		  }
		  break;
	  case 2:
		if(!configuration['lastTimeGotPrescription']) {
			return true;
		}
		break;
	  case 3:
		if(!configuration['lastTimeInPharmacy']) {
			return true;
		}
		break;
	  case 4:
		if(!configuration['lastTimeGotReferral']) {
			return true;
		}
		break;
	  case 5:
		if(!configuration['lastTimeExamination']) {
			return true;
		}
		break;
	  default:
		return false;
	}
	return false;
  };

async function getFileCalendarData(configuration, notifications, method) {

	let calendarId = await encryptionHelper.MD5(configuration.User.createdAt.toString() + configuration.User.Id);
	// https://stackoverflow.com/questions/10551764/how-to-cancel-an-calendar-event-using-ics-files
    const cal = ical({
        domain: 'reminder.com',
        prodId: {company: 'ereminder.com', product: 'ereminder'},
        name: 'E-reminder',
        method: method === 'publish' ? method : 'REQUEST',
    });

    cal.x('X-WR-RELCALID', calendarId);

    for (var i=0; i<notifications.length; i++) {
		let notification = notifications[i];
		let notificationTypeId = notification.NotificationTypeId;
		if(isNotificationConfigurationDateEmpty(notificationTypeId, configuration)) {
			continue;
		}
        
		if(notificationTypeId !== constants.NotificationType.Medicine) {
			await addEvent(calendarId, cal, notification, notificationTypeId, configuration, method);
			continue;
		}

        if(notification && notification.IntervalId == constants.NotificationInterval.TwelveHours) {
			// we need 2 events in one day when we have 12H reminder (one for PM and one for AM hours)
			await addEvent(calendarId, cal, notification, notificationTypeId, configuration, method);
            await addEvent(calendarId, cal, notification, notificationTypeId, configuration, method, 12);
            continue;
		}
		
		if(notification && notification.IntervalId == constants.NotificationInterval.TwentyFourHours) {
            await addEvent(calendarId, cal, notification, notificationTypeId, configuration, method, 24);
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
	let beginTime = lastTimeInitConfiguration;

    if(hoursToAdd){
		beginTime.setHours(beginTime.getHours() + hoursToAdd);
        calendarId = calendarId + hoursToAdd;
	}
	// when deleting (canceling event) SEQUENCE must be greater than the created event
    let event =  cal.createEvent({
        uid: calendarId + notificationTypeId,
        summary : constants.NotificationsCalendarTitles[notificationTypeId],
        start: beginTime,
        sequence: method === methods.CANCEL ? 2 : 1,
        end: beginTime,
        timestamp: moment()
    });

    event.status(method === methods.CANCEL || !notification ? 'cancelled' : 'confirmed');
    event.createAttendee({email: configuration.User.email});

    if(notification) {
        event.repeating(constants.NotificationIntervalRepeating[notification.IntervalId]);
    }
    return event;
}