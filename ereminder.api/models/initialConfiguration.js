"use strict";
module.exports = (sequelize, DataTypes) => {
  var Configuration = sequelize.define("Configuration", {
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

  Configuration.associate = function(models) {
    models.Configuration.belongsTo(models.User, {
      foreignKey: {
        unique: true
      }
    });
  };

  return Configuration;
};
