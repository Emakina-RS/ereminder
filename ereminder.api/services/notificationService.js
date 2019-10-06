'use strict'

const models = require('../models');
const constants = require('../config/constants');
const mailer = require('../core/mailer');
const configurationService = require('../services/configurationService');

require('../config/config');
const mailSubjects = global.globalConfig.mailSubjects;
const notificationEmailSubjects = getNotificationEmailSubjects();

exports.updateNotifications = async function (notificationsArray, userId) {
    return await notificationsArray.forEach(notificationParams => {
        let noteId = notificationParams.notificationId,
            typeId = notificationParams.notificationTypeId,
            intervalId = notificationParams.notificationIntervalId;

        if (noteId) {
            if (typeId && intervalId) {
                return updateNotification(noteId, typeId, intervalId);
            }

            return deleteNotification(noteId, userId);
        }
        else if (typeId && intervalId) {
            return createNotification(typeId, intervalId, userId);
        }
    });
}

exports.sendEmailNotifications = async function () {
    let sqlQuery = `SELECT n.id as 'Id', u.id as 'userId', u.email, n.lastTimeSent, n.nextTimeSent, i.valueInHours, n.NotificationTypeId FROM notifications n
                        INNER JOIN intervals i ON n.IntervalId = i.Id
                        INNER JOIN users u ON n.UserId = u.Id
                        INNER JOIN notificationtypes nt ON n.NotificationTypeId = nt.Id
                    WHERE n.nextTimeSent < NOW()`;

    let notifications = await models.sequelize
        .query(sqlQuery, {
            type: models.sequelize.QueryTypes.SELECT
        });

    let currentDate = new Date();

    for (let i = 0; i < notifications.length; i++) {
        let notification = notifications[i];
        let body = createEmailNotificationHtmlBody(notification);
        let nextTimeSent = currentDate.setHours(currentDate.getHours() + notification.valueInHours);

        await mailer.send(notificationEmailSubjects[notification.NotificationTypeId], body, notification.email);
        await models.Notification.update( { lastTimeSent: new Date(), nextTimeSent: new Date(nextTimeSent) }, { where: { id: notification.Id} });
    }
};

exports.getNotificationDashboard = async function (userId) {
    let usersConfiguration = await getDashboardForUpdating(userId);
    return await notificationDashboard(usersConfiguration);
};

function getNotificationEmailSubjects() {
    let subjects = {}

    subjects[constants.NotificationType.Medicine] = mailSubjects.medicineEmailSubject;
    subjects[constants.NotificationType.Recepies] = mailSubjects.recepieEmailSubject;
    subjects[constants.NotificationType.Pharmacy] = mailSubjects.pharmacyEmailSubject;
    subjects[constants.NotificationType.Referral] = mailSubjects.referralEmailSubject;
    subjects[constants.NotificationType.MedicalFindings] = mailSubjects.medicalFindingsEmailSubject;

    return subjects;
}

function createEmailNotificationHtmlBody(notification) {
    //TODO: format the email template
    return "Reminder text";
}

async function getDashboardForUpdating(userID) {
    return await models.Notification.findAll({
        where:{ UserId: userID },
        include: [{
            model: models.Interval,
            attributes : ['id'],
            as:'Interval',
            required: true
        }]
    });
}

async function notificationDashboard(usersConfiguration) {
    let allConfiguration = await getAllConfiguration();
    allConfiguration = allConfiguration.map(function(notificationType){
        return {
            intervals: notificationType.intervals.map((interval) => {
                return { id: interval.id,
                        displayName: interval.displayName,
                        checked: false
                    };}),
            key: constants.NotificationTypeDictionary[notificationType.id],
            notificationTypeId: notificationType.id,
            notificationTypeDisplay: notificationType.value,
            checked: false
        }
    });

    if(!usersConfiguration.length){
        return allConfiguration;
    }

    usersConfiguration.forEach((config) => {
        updateMatchingConfiguration(allConfiguration, config)
    });

    return arrayToObject(allConfiguration, "key");
}

async function getAllConfiguration() {
    return await models.NotificationType.findAll({
        include: [{
            model: models.Interval,
            attributes : ['id', 'displayName'],
            as:'intervals',
            required: true
        }]
    });
}

async function createNotification(notificationTypeId, notificationIntervalId, userId) {
    let nextTimeToSend = await calculateNextNotificationTime(notificationTypeId, notificationIntervalId, userId, null);

    return await models.Notification.create({
        nextTimeSent: nextTimeToSend,
        NotificationTypeId: notificationTypeId,
        IntervalId: notificationIntervalId,
        UserId: userId
    });
}

async function updateNotification(notificationId, notificationTypeId, notificationIntervalId) {
    return await models.Notification.findByPk(notificationId)
        .then(notification => {
            if (notification) {
                notification.update({
                    NotificationTypeId: notificationTypeId,
                    IntervalId: notificationIntervalId
                });
            }
        });
}

async function deleteNotification(notificationId, userId) {
    return await models.Notification.findByPk(notificationId)
        .then(notification => {
            if (notification && notification.UserId == userId) {
                notification.destroy();
            }
        });
}

async function calculateNextNotificationTime(notificationTypeId, notificationIntervalId, userId, lastTimeSent) {
    let configuration = await configurationService.GetConfiguration(userId);
    let lastTimeConfiguration = configurationService.GetLastTimeConfiguration(notificationTypeId, configuration);

    if (lastTimeSent == null) {
        return lastTimeConfiguration;
    }
}

function updateMatchingConfiguration(array, config) {
    array.forEach((item) => {
        if(item.notificationTypeId ===  config.NotificationTypeId) {
            let checked = false;
            item.intervals.forEach((interval) => {
                if(interval.id === config.Interval.id){
                    interval.checked = true;
                    checked = true;
                }
            });
            if(checked){
                item.checked = true;
                item.notificationId = config.id;
                item.intervalId = config.Interval.id;
            }
        }
    });
}

const arrayToObject = (array, keyField) =>
    array.reduce((obj, item) => {
        obj[item[keyField]] = item
        return obj
    }, {});

async function createCalendarEvent(body, userId) {
    return models.Notification.create({
        // lastTimeSent: '2019-10-05 15:53:34',
        IntervalId: constants.NotificationInterval[body.notificationInterval],
        NotificationTypeId: constants.NotificationType[body.notificationType],
        UserId: userId
    })
    .then(newNotification => { return newNotification; });
};