"use strict";

const notificationService = require("../services/notificationService");

exports.UpdateNotifications = async function (req, res) {
  await notificationService.updateNotifications(req.body, req.user.id);

  return res.status(200).json({ message: "Notifications updated." });
};

exports.GetNotificationDashboard = async function (req, res) {
  let dashboard = await notificationService.getNotificationDashboard(
    req.user.id
  );

  return res.status(200).json(dashboard);
};