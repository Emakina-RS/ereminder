'use strict'
const models = require('../models');

exports.getAllNotifications = function (request, response) {
    models.Notification.findAll().then(notifications => response.json(notifications));
};