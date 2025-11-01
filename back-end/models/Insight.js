// models/Insight.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Insight = sequelize.define('Insight', {
  title: {
    type: DataTypes.STRING,
    allowNull: false 
  },
  excerpt: {
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'General'
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true 
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Admin'
  },
  published: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'insights',
  timestamps: true,   
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Insight;