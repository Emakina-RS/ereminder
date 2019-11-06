"use strict";

require("express-async-errors");
const cors = require("cors");
const util = require("util");
const express = require("express");
const dbIntializer = require("./dbInitializer");
const scheduler = require("./core/scheduler.js");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");
const authenticationHelper = require("./helpers/authenticationHelper");
const error = require("./middleware/error");
const logger = require("./startup/logger")();
const rateLimiters = require("./middleware/rateLimiters");

require("./config/config");
const corsUrls = global.globalConfig.corsUrls;

var app = express()
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(cors(corsUrls));

authenticationHelper(app);
routes(app);

app.use(error);
app.use(express.json({ limit: '10kb' }));
app.use(rateLimiters.NumberOfRequestsLimiter);

var server = app.listen(global.globalConfig.apiPort, function() {
  var port = server.address().port;
  logger.info(
    `[Server] : Example app listening at ${global.globalConfig.apiUrl}:${port}`
  );
});

dbIntializer.initializeDB(server);
scheduler.initialize();

process.on("uncaughtException", error => {
  logger.error(
    util.format(
      `[Server] : There was an uncaught error: ${error.message}, stack trace: ${error.stack}`
    )
  );
  process.exit(1);
});