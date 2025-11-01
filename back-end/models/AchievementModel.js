// models/Achievement.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Achievement = sequelize.define('Achievement', {
  label: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: false 
    }
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  suffix: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  icon: {
    type: DataTypes.ENUM('Trophy', 'Users', 'Building2', 'Award', 'TrendingUp'),
    allowNull: false,
    defaultValue: 'Building2'
  }
}, {
  tableName: 'achievements', // optional: ensures table name is plural & consistent
  timestamps: true,          // enables createdAt and updatedAt
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Achievement;