'use strict'
const models = require('../models');
const constants = require('../config/constants');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const mailer = require('../core/mailer');
const authenticationHelper = require('../helpers/authenticationHelper');

exports.createNotification = async function (req) {
    var currentUserId = authenticationHelper.getUserIdFromRequest(req);
    return await create(req.body, currentUserId);
}

async function create(body, userId) {
    return models.Notification.create({
        // lastTimeSent: '2019-10-05 15:53:34',
        IntervalId: body.intervalId,
        NotificationTypeId: body.notificationTypeId,
        UserId: userId
    })
    .then(newNotification => { return newNotification; });
};

exports.sendFrequentNotifications = function () {
    models.Notification.findAll({
        include: [{
            model: models.NotificationType,
            where: {
                id: constants.NotificationType.Medicine
            }
        }]
    })
    .then(queryRes => {
        console.log("Success! Now send email:");
        mailer.sendPendingNotifications();
    })
    .catch(err => console.log(err));
};

exports.sendNonFrequentNotifications = function () {
    models.Notification.findAll({
        include: [{
            model: models.NotificationType,
            where: {
                id: {
                    [Op.ne]: constants.NotificationType.Medicine
                }
            }
        }]
    })
    .then(queryRes => {
        console.log("Success! Now send email:");
        mailer.sendPendingNotifications();
    })
    .catch(err => console.log(err));
};

exports.getAllNotifications = function (request, response) {
    models.Notification.findAll().then(notifications => response.json(notifications));
};


exports.getNotificationDashboard = async function (userID) {

    let usersConfiguration = await getDashboardForUpdating(userID);

    return await NotificationDashboard(usersConfiguration);
};

async function getDashboardForUpdating(userID){

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

async function NotificationDashboard(usersConfiguration){

    let allConfiguration = await getAllConfiguration();
    allConfiguration = allConfiguration.sort((a, b) => {
        return a.id > b.id;
    }).map(function(notificationType){
        return {
            intervals: notificationType.intervals.map((interval) => {
                return { id: interval.id,
                        displayName: interval.displayName,
                        valueInHours: interval.valueInHours,
                        checked: false
                    };}),
            notificationTypeId: notificationType.id,
            notificationTypeValue: notificationType.value,
            checked: false
        }
    });
    if(!usersConfiguration.length){
        return allConfiguration;
    }

    usersConfiguration.forEach((config) => {
        updateMatchingConfiguration(allConfiguration, config.Interval.id,  config.NotificationTypeId)
    });

    return allConfiguration;
}

async function getAllConfiguration(){
    return await models.NotificationType.findAll({
        include: [{
            model: models.Interval,
            attributes : ['id', 'displayName', 'valueInHours'],
            as:'intervals',
            required: true
        }]
    });
}

function updateMatchingConfiguration(array, intervalId, notificationTypeId){
    array.forEach((item) => {
        if(item.notificationTypeId === notificationTypeId) {
            item.intervals.forEach((interval) => {
                if(interval.id===intervalId){
                    interval.checked = true;
                    item.checked = true;
                }
            });
        }
    })
}

