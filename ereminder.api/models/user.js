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
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  User.associate = function (models) {
    models.User.hasOne(models.InitialConfiguration, {
      foreignKey: {
        allowNull: false
      }
    });

    models.User.hasMany(models.Notification, {
      as: 'notifications'
    });
};

  return User;
};
