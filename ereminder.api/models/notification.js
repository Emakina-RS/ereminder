'use strict';
module.exports = (sequelize, DataTypes) => {
  var Notification = sequelize.define('Notification', {
     id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    lastTimeSent: DataTypes.DATE
  });

  Notification.associate = function (models) {
    models.Notification.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  Notification.associate = function (models) {
    models.Notification.belongsTo(models.NotificationType, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  Notification.associate = function (models) {
    models.Notification.belongsTo(models.Interval, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Notification;
};
