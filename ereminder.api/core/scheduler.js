"use strict";

const cron = require("node-cron");
const notificationService = require("../services/notificationService");
const logger = require("../startup/logger");

exports.initialize = function() {
  cron.schedule("*/3 * * * *", function() {
    logger.info(
      `[Core:Scheduler] : Notifications scheduler is started. It will be running every 3 minutes.`
    );

    notificationService.sendEmailNotifications();
  });
};
