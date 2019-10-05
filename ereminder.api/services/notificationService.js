'use strict'
const models = require('../models');
const constants = require('../config/constants');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const mailer = require('../core/mailer');

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