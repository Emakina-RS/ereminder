"use strict";

const calendarService = require("../services/calendarService");

exports.GetCalendar = async function(req, res) {
  let user = await req.user;
  let calendarData = await calendarService.getCalendar(
    user.id,
    new Date(req.body.startDate),
    new Date(req.body.endDate)
  );

  res.status(200).json(calendarData);
};
