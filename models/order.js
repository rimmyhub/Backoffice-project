'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.Review, {
        sourceKey: 'order_id',
        foreignKey: 'Order_id',
      });
      this.hasMany(models.OrderDetail, {
        sourceKey: 'order_id',
        foreignKey: 'Order_id',
      });
      this.belongsTo(models.Restaurant, {
        targetKey: 'restaurant_id',
        foreignKey: 'Restaurant_id',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.Client, {
        targetKey: 'client_id',
        foreignKey: 'Client_id',
        onDelete: 'CASCADE',
      });
    }
  }
  Order.init(
    {
      order_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      Restaurant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      modelName: 'Order',
    }
  );
  return Order;
};
