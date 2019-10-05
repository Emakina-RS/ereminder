'use strict';
module.exports = (sequelize, DataTypes) => {
  var Interval = sequelize.define('Interval', {
     id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    DisplayName: DataTypes.STRING,
    ValueInMinutes: DataTypes.INTEGER
  });

  Interval.associate = function (models) {
    models.Interval.belongsToMany(models.NotificationType, {
        through: 'NotificationTypeInterval',
        as: 'notificationTypes',
        foreignKey: 'intervalId',
        otherKey: 'notificationTypeId'
    });
  };

  return Interval;
};
