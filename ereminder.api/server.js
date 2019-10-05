'use strict'

var cors = require('cors');
const express = require('express');
const dbIntializer = require('./dbInitializer');
const schedule = require('./core/scheduler.js');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const authenticationHelper = require('./helpers/authenticationHelper');

const config = require('./config/config');
const corsUrls = global.globalConfig.corsUrls;

schedule.frequentReminderJob();
schedule.dailyReminderJob();

var app = express()
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(cors(corsUrls));

authenticationHelper(app);
routes(app);

var server = app.listen(global.globalConfig.apiPort, function () {
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", global.globalConfig.apiUrl, port);
});

dbIntializer.initializeDB(server);