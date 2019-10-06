'use strict'

const authenticationHelper = require('../helpers/authenticationHelper');
const notificationService = require('../services/notificationService');

exports.UpdateNotifications = async function(req, res) {
    try {
        let currentUserID = authenticationHelper.getUserIdFromRequest(req);
        await notificationService.updateNotifications(req.body, currentUserID);
        return res.status(200).json({ message: 'Notifications updated.' });
    } catch(e) {
        return res.status(500).json({ error: 'ERROR: Internal server error.' });
    }
}

exports.UpdateNotification = function(request, response) {
    response.send('updating  notification');

    //TODO:
}

exports.getNotificationDashboard = async function(req, res) {
    try{
        var currentUserID = authenticationHelper.getUserIdFromRequest(req);
        let dashboard = await notificationService.getNotificationDashboard(currentUserID);
        return res.status(200).json(dashboard);
    } catch(e){
        return res.status(500).json({ error: 'Internal error' })
    }
}

exports.getConfigurationDashboard = async function(req, res) {
    try{
        var currentUserID = authenticationHelper.getUserIdFromRequest(req);
        let dashboard = await notificationService.getConfigurationDashboard(currentUserID);
        return res.status(200).json(dashboard);
    } catch(e){
        return res.status(500).json({ error: 'Internal error' })
    }
}