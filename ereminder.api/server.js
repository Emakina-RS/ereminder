'use strict'

const express = require('express');
const dbIntializer = require('./dbInitializer');
const schedule = require('./core/scheduler.js');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const authenticationHelper = require('./helpers/AuthenticationHelper');

schedule.frequentReminderJob();
schedule.dailyReminderJob();

var app = express()
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json());

authenticationHelper(app);
routes(app);

var server = app.listen(8081, function () {
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", 'dev.ereminder.com', port);
});

dbIntializer.initializeDB(server);