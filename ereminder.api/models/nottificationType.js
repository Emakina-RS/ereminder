'use strict';
module.exports = (sequelize, DataTypes) => {
  var NotificationType = sequelize.define('NotificationType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

  });

  NotificationType.associate = function (models) {
    models.NotificationType.belongsTo(models.Notification, {
      onDelete: "restrict",
      foreignKey: {
        allowNull: false
      }
    });
    models.NotificationType.belongsToMany(models.Interval, {
      through: 'NotificationTypeInterval',
      as: 'intervals',
      foreignKey: 'notificationTypeId',
      otherKey: 'intervalId'
    });
  };

  return NotificationType;
};
