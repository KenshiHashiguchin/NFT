'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Nft extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Nft.init({
    status: DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    token: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    hash: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Nft',
  });
  return Nft;
};