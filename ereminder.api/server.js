const express = require('express');
const app = express();
const schedule = require('./core/scheduler.js');

schedule.frequentReminderJob();
schedule.dailyReminderJob();

var server = app.listen(8081, function () {
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", 'dev.ereminder.com', port);
});