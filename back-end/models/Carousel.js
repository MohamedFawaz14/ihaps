const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Carousel = sequelize.define('Carousel', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deviceType: {
    type: DataTypes.ENUM('mobile', 'desktop'), // ✅ Added
    allowNull: false
  }
}, {
  tableName: 'carousels',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Carousel;
