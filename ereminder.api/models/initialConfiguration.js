'use strict';
module.exports = (sequelize, DataTypes) => {
  var InitialConfiguration = sequelize.define('InitialConfiguration', {
     id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    lastTimeTookPills: DataTypes.DATE,
    lastTimeInPharmacy: DataTypes.DATEONLY,
    lastTimeGotPrescription: DataTypes.DATEONLY,
    lastTimeGotReferral: DataTypes.DATEONLY,
    lastTimeExamination: DataTypes.DATEONLY
  });

  InitialConfiguration.associate = function (models) {
    models.InitialConfiguration.belongsTo(models.User, {
      foreignKey: {
        allowNull: true
      }
    });
  };

  return InitialConfiguration;
};
