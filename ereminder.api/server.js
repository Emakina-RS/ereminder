"use strict";

require("express-async-errors");
const cors = require("cors");
const util = require("util");
const express = require("express");
const dbIntializer = require("./dbInitializer");
const scheduler = require("./core/scheduler.js");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");
const authentication = require("./middleware/authentication");
const error = require("./middleware/error");
const logger = require("./startup/logger")();
const rateLimiters = require("./middleware/rateLimiters");
const xss = require("xss-clean");

require("./config/config");
const corsUrls = global.globalConfig.corsUrls;

var app = express()
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(cors({
    origin: corsUrls
  }))
  .use(xss())
  .use(express.json({ limit: "10kb" }))
  .use(rateLimiters.NumberOfRequestsLimiter);

authentication(app);
routes(app);

app.use(error);

var server = app.listen(global.globalConfig.apiPort, global.globalConfig.apiHostname, function () {
  var port = server.address().port;

  console.log('server url: ' + server.address().address);


  logger.info(
    `[Server] : Example app listening at ${global.globalConfig.apiHostname}:${port}`
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
