'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProfileImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Client, {
        targetKey: 'client_id',
        foreignKey: 'Client_id',
        onDelete: 'CASCADE',
      });
    }
  }
  ProfileImage.init(
    {
      uuid: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
      },
      imageUrl: {
        type: DataTypes.STRING,
      },
      Client_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'ProfileImage',
      timestamps: false,
    }
  );
  return ProfileImage;
};
