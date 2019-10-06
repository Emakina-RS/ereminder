'use strict'

const authenticationHelper = require('../helpers/authenticationHelper');
const notificationService = require('../services/notificationService');

exports.UpdateNotifications = async function(req, res) {
    try {
        let currentUserId = authenticationHelper.getUserIdFromRequest(req);

        await notificationService.updateNotifications(req.body, currentUserId);
        return res.status(200).json({ message: 'Notifications updated.' });
    }
    catch(e) {
        return res.status(500).json({ error: 'ERROR: Internal server error.' });
    }
}

exports.UpdateNotification = function(request, response) {
    response.send('updating  notification');

    //TODO:
}

exports.GetNotificationDashboard = async function(req, res) {
    try {
        let currentUserId = authenticationHelper.getUserIdFromRequest(req);
        let dashboard = await notificationService.getNotificationDashboard(currentUserId);

        return res.status(200).json(dashboard);
    }
    catch(e) {
        return res.status(500).json({ error: 'Internal error' })
    }
}