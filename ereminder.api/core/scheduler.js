const cron = require('node-cron');

exports.frequentReminderJob = function () {
    cron.schedule("*/3 * * * *", function() {
        console.log("running a task every 3 minutes");
    });
};

exports.dailyReminderJob = function () {
    cron.schedule("* 10 * * *", function() {
        console.log("running a task every day at 10 AM");
    });
};

