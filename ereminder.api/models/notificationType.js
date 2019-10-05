'use strict';
module.exports = (sequelize, DataTypes) => {
  var NotificationType = sequelize.define('NotificationType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    value: DataTypes.STRING
  });

  NotificationType.associate = function (models) {
    models.NotificationType.belongsToMany(models.Interval, {
      through: 'NotificationTypeInterval',
      as: 'intervals',
      foreignKey: 'notificationTypeId',
      otherKey: 'intervalId'
    });

    models.NotificationType.hasMany(models.Notification);
  };

  return NotificationType;
};