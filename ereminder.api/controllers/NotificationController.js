'use strict'

const notificationService = require('../services/notificationService');

exports.UpdateNotifications = async function(req, res) {
    try {
        let user = await req.user;
        await notificationService.updateNotifications(req.body, user.id);

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
        let user = await req.user;
        let dashboard = await notificationService.getNotificationDashboard(user.id);

        return res.status(200).json(dashboard);
    }
    catch(e) {
        return res.status(500).json({ error: 'Internal error' })
    }
}