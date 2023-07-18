'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Order, {
        targetKey: 'order_id',
        foreignKey: 'Order_id',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.Menu, {
        targetKey: 'menu_id',
        foreignKey: 'Menu_id',
        onDelete: 'CASCADE',
      });
    }
  }
  OrderDetail.init(
    {
      order_detail_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      Order_id: {
        type: DataTypes.INTEGER,
      },
      Menu_id: {
        type: DataTypes.INTEGER,
      },
      count: {
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
      modelName: 'OrderDetail',
    }
  );
  return OrderDetail;
};
