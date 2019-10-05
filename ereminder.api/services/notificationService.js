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