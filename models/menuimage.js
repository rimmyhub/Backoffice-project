'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MenuImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Menu, {
        targetKey: 'menu_id',
        foreignKey: 'Menu_id',
        onDelete: 'CASCADE',
      });
    }
  }
  MenuImage.init(
    {
      uuid: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Restaurant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'MenuImage',
      timestamps: false,
    }
  );
  return MenuImage;
};
