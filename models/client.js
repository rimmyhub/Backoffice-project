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
      this.hasMany(models.ProfileImage, {
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
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
      },
      phone_num: {
        type: DataTypes.STRING,
      },
      client_image: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:
          'https://issuebombom-awsbucket.s3.ap-northeast-2.amazonaws.com/images/profile/1689841609097_22bc8ad7-0051-4572-8597-616fdb618776',
      },
      introduction: {
        type: DataTypes.STRING,
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1000000,
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
