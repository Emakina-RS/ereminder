'use strict'
const models = require('../models');
const authenticationHelper = require('../helpers/authenticationHelper');
const notificationService = require('../services/notificationService');

exports.CreateNotification = async function(req, res) {
    try {
        await notificationService.createNotification(req);
        return res.status(200).json({ message: 'Notification created!' })
    } catch(e) {
        return res.status(500).json({ error: 'ERROR: Internal server error!' })
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