"use strict";

const calendarService = require("../services/calendarService");

exports.GetCalendar = async function(req, res) {
  let calendarData = await calendarService.getCalendar(
    req.user.id,
    new Date(req.body.startDate),
    new Date(req.body.endDate)
  );

  res.status(200).json(calendarData);
};
