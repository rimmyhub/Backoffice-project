'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // this.hasMany(models.OrderDetail, {
      //   sourceKey: 'review_id',
      //   foreignKey: 'Review_id',
      // });
      this.belongsTo(models.Client, {
        targetKey: 'client_id',
        foreignKey: 'Client_id',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.Order, {
        targetKey: 'order_id',
        foreignKey: 'Order_id',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.Restaurant, {
        targetKey: 'restaurant_id',
        foreignKey: 'Restaurant_id',
        onDelete: 'CASCADE',
      });
    }
  }
  Review.init(
    {
      review_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      Client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Restaurant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
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
      modelName: 'Review',
    }
  );
  return Review;
};
