'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    }
  });

  User.associate = function (models) {
    models.InitialConfiguration.belongsTo(models.InitialConfiguration, {
      foreignKey: {
        allowNull: false
      }
    });

    models.InitialConfiguration.hasMany(models.Notification, {
      as: 'notifications'
    });
};

  return User;
};
