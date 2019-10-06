'use strict'

const cron = require('node-cron');
const notificationService = require('../services/notificationService');

exports.initialize = function() {
    cron.schedule("*/3 * * * *", function() {
        console.log("running a task every 3 minutes");

        notificationService.sendEmailNotifications();
    });
};