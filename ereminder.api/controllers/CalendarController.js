"use strict";

const calendarService = require("../services/calendarService");

exports.GetCalendar = async function(req, res) {
  let calendarData = await calendarService.getCalendar(
    req.user.id,
    new Date(req.params.startdate),
    new Date(req.params.enddate)
  );

  res.status(200).json(calendarData);
};