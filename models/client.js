'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Review, {
        sourceKey: 'client_id',
        foreignKey: 'Client_id',
      });
      this.hasMany(models.Order, {
        sourceKey: 'client_id',
        foreignKey: 'Client_id',
      });
    }
  }
  Client.init(
    {
      client_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      phone_num: {
        type: DataTypes.INTEGER,
      },
      client_image: {
        type: DataTypes.STRING,
      },
      introduction: {
        type: DataTypes.STRING,
      },
      point: {
        type: DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Client',
    }
  );
  return Client;
};
