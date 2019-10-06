'use strict'

const models = require('../models');

exports.getCalendar = async function(userId, fromDate, toDate) {
    let initialConfiguration = await models.Notification.findOne({ UserId: userId });

    let notificationsData = await models.sequelize
        .query('SELECT n.NotificationTypeId, nt.value, n.IntervalId, i.displayName  FROM notifications n ' +
                    'INNER JOIN users u ON n.UserId = u.Id ' +
                    'INNER JOIN notificationtypes nt ON n.NotificationTypeId = nt.Id ' +
                    'INNER JOIN intervals i ON n.IntervalId = i.Id')


    //TODO: calculate dates in the given date range

    return notificationsData;
}