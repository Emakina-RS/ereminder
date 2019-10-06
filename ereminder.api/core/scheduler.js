'use strict'

const cron = require('node-cron');
const notificationService = require('../services/notificationService');

exports.initialize = function() {
    frequentReminderJob();
    dailyReminderJob();
}

function frequentReminderJob() {
    cron.schedule("*/3 * * * *", function() {
        console.log("running a task every 3 minutes");
        notificationService.sendFrequentNotifications();
    });
};

function dailyReminderJob() {
    cron.schedule("* 10 * * *", function() {
        console.log("running a task every day at 10 AM");
        notificationService.sendNonFrequentNotifications();
    });
};