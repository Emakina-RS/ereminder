'use strict'

const cron = require('node-cron');
const mailer = require('./mailer');
const notificationService = require('../services/notificationService');

exports.frequentReminderJob = function () {
    // TODO: array of all Notifications that are pending and sent on daily basis
    // then pass them as param to sendPendingNotifications()
    cron.schedule("*/3 * * * *", function() {
        console.log("running a task every 3 minutes");
        let allNotifications = notificationService.getAllNotifications();
        // console.log(allNotifications);
        //mailer.send(); //TODO: make a call here to the notificationService, which will prepare and send an email.
    });
};

exports.dailyReminderJob = function () {
    // TODO: array of all Notifications that are pending and sent on monthly basis
    // then pass them as param to sendPendingNotifications()
    cron.schedule("* 10 * * *", function() {
        console.log("running a task every day at 10 AM");
        //mailer.send(); //TODO: make a call here to the notificationService, which will prepare and send an email.
    });
};

