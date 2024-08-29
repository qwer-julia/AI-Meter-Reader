'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Measure extends Model {
    static associate(models) {
      // define association here
    }
  }
  Measure.init({
    measure_uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true
    },
    measure_datetime: DataTypes.DATE,
    measure_value: DataTypes.INTEGER,
    measure_type: DataTypes.STRING,
    has_confirmed: {type: DataTypes.BOOLEAN, defaultValue: false},
    image_url: DataTypes.STRING,
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  }, {
    sequelize,
    modelName: 'Measure',
    tableName: 'measures',
  });
  return Measure;
};