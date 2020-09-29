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
const xss = require("xss-clean");
const fs = require("fs");
const https = require('https');

require("./config/config");
const corsUrls = global.globalConfig.corsUrls;

var app = express()
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(cors({
    origin: corsUrls
  }))
  .use(xss())
  .use(express.json({ limit: "10kb" }));

authentication(app);
routes(app);

app.use(error);

const server = global.globalConfig.ssl.enabled ? getHttpsServer() : getHttpServer();

dbIntializer.initializeDB(server);
scheduler.initialize();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

process.on("uncaughtException", error => {
  logger.error(
    util.format(
      `[Server] : There was an uncaught error: ${error.message}, stack trace: ${error.stack}`
    )
  );
  process.exit(1);
});

function getHttpServer() {
  const server = app.listen(global.globalConfig.apiPort, global.globalConfig.apiHostname, function () {
    const port = server.address().port;

    console.log('server url: ' + server.address().address);

    logger.info(`[Server] : Example app listening at ${global.globalConfig.apiHostname}:${port}`);
  });

  return server;
}

function getHttpsServer() {
  const server = https.createServer({
    key: fs.readFileSync(global.globalConfig.ssl.key),
    cert: fs.readFileSync(global.globalConfig.ssl.cert)
  }, app)
  .listen(global.globalConfig.apiPort, global.globalConfig.apiHostname, function () {
      const port = server.address().port;
    
      console.log('server url: ' + server.address().address);
    
      logger.info(`[Server] : Example app listening at ${global.globalConfig.apiHostname}:${port}`);
  });
  
  return server;
}
