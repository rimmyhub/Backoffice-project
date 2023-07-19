'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 사장과 1대1 어떻게?
      this.belongsTo(models.Owner, {
        sourceKey: 'owner_id',
        foreignKey: 'Owner_id',
      });
      this.hasMany(models.Review, {
        sourceKey: 'restaurant_id',
        foreignKey: 'Restaurant_id',
      });
      this.hasMany(models.Order, {
        sourceKey: 'restaurant_id',
        foreignKey: 'Restaurant_id',
      });
      this.hasMany(models.Menu, {
        sourceKey: 'restaurant_id',
        foreignKey: 'Restaurant_id',
      });
    }
  }
  Restaurant.init(
    {
      restaurant_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      Owner_id: {
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      phone_num: {
        type: DataTypes.STRING,
      },
      biz_hours: {
        type: DataTypes.STRING,
      },
      category: {
        type: DataTypes.STRING,
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
      modelName: 'Restaurant',
    }
  );
  return Restaurant;
};
