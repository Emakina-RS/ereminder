'use strict'

const calendarService = require('../services/calendarService');

exports.GetCalendar = async function(req, res) {
    try {
        let user = await req.user;
        let calendarData = await calendarService.getCalendar(user.id, new Date(req.body.startDate), new Date(req.body.endDate));

        res.status(200).json(calendarData);
    }
    catch(e) {
        res.status(500).json({
            message: e.message
        });
    }
}