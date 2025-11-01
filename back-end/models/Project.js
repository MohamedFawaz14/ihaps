// models/Project.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  plotType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pricePerSquareFoot: {
    type: DataTypes.DECIMAL(10, 2), // or DataTypes.FLOAT if you prefer
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'On-Going'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mainImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON, 
    allowNull: true,
    defaultValue: []
  },
  amenities: {
    type: DataTypes.JSON, 
    allowNull: true,
    defaultValue: []
  },
  specifications: {
    type: DataTypes.JSON, 
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'projects',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Project;