'use strict'
const models = require('../models');
const constants = require('../config/constants');
const mailer = require('../core/mailer');

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

exports.sendFrequentNotifications = function () {
    //TODO
};

exports.sendNonFrequentNotifications = function () {
    //TODO
};

exports.getNotificationDashboard = async function (userId) {
    let usersConfiguration = await getDashboardForUpdating(userId);
    return await notificationDashboard(usersConfiguration);
};

exports.getConfigurationDashboard = async function (userId) {
    return await models.InitialConfiguration.findOne({ UserId: userId });
};

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
    return await models.Notification.create({
        NotificationTypeId: notificationTypeId,
        IntervalId: notificationIntervalId,
        UserId: userId
    });
}

async function updateNotification(notificationId, notificationTypeId, notificationIntervalId) {
    return await models.Notification.findByPk(notificationId)
        .then(notification => {
            notification.update({
                NotificationTypeId: notificationTypeId,
                IntervalId: notificationIntervalId
            });
        });
}

async function deleteNotification(notificationId, userId) {
    return await models.Notification.findByPk(notificationId)
        .then(notification => {
            if (notification.UserId == userId) {
                notification.destroy();
            }
        });
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

async function create(body, userId) {
    return models.Notification.create({
        // lastTimeSent: '2019-10-05 15:53:34',
        IntervalId: constants.NotificationInterval[body.notificationInterval],
        NotificationTypeId: constants.NotificationType[body.notificationType],
        UserId: userId
    })
    .then(newNotification => { return newNotification; });
};