// models/Gallery.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Gallery = sequelize.define('Gallery', {
  title: {
    type: DataTypes.STRING,
    allowNull: false // required
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false 
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false 
  }
}, {
  tableName: 'galleries', 
  timestamps: true,      
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Gallery;