'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.OrderDetail, {
        sourceKey: 'menu_id',
        foreignKey: 'Menu_id',
      });
      this.belongsTo(models.Restaurant, {
        targetKey: 'restaurant_id',
        foreignKey: 'Restaurant_id',
        onDelete: 'CASCADE',
      });
    }
  }
  Menu.init(
    {
      menu_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      Restaurant_id: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      menu_image: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.INTEGER,
      },
      sold_out: {
        type: DataTypes.BOOLEAN,
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
      modelName: 'Menu',
    }
  );
  return Menu;
};
