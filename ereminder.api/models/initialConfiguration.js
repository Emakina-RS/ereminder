"use strict";
module.exports = (sequelize, DataTypes) => {
  var InitialConfiguration = sequelize.define("InitialConfiguration", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    lastTimeTookPills: DataTypes.DATE,
    lastTimeInPharmacy: DataTypes.DATEONLY,
    lastTimeGotPrescription: DataTypes.DATEONLY,
    lastTimeGotReferral: DataTypes.DATEONLY,
    lastTimeExamination: DataTypes.DATEONLY,
    enableEmailNotification: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    enableCalendarNotification: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  InitialConfiguration.associate = function(models) {
    models.InitialConfiguration.belongsTo(models.User, {
      foreignKey: {
        unique: true
      }
    });
  };

  return InitialConfiguration;
};
