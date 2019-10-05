'use strict'

const cors = require('cors');
const util = require('util');
const express = require('express');
const dbIntializer = require('./dbInitializer');
const schedule = require('./core/scheduler.js');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const authenticationHelper = require('./helpers/authenticationHelper');
const logger = require('./helpers/logger');

const config = require('./config/config');
const corsUrls = global.globalConfig.corsUrls;

schedule.frequentReminderJob();
//schedule.dailyReminderJob();

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

process.on('uncaughtException', (error) => {
    logger.LogError(util.format('There was an uncaught error: %s, stack trace: %s', error.message, error.stack));
    process.exit(1);
});