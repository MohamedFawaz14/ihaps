// models/Service.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Service = sequelize.define('Service', {
  title: {
    type: DataTypes.STRING,
    allowNull: false 
  },
  description: {
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  iconName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Home'
  }
}, {
  tableName: 'services',
  timestamps: true,    
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Service;