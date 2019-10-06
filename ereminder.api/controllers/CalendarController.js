'use strict'

const calendarService = require('../services/calendarService');
const authenticationHelper = require('../helpers/authenticationHelper');

exports.GetCalendar = async function(req, res) {
    try {
        let useId = authenticationHelper.getUserIdFromRequest(req);
        let calendarData = await calendarService.getCalendar(useId, req.body.from, req.body.to);

        res.status(200).json({
            calendarData
        });
    }
    catch(e) {
        res.status(500).json({
            message: e.message
        });
    }
}