// models/Testimonial.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Testimonial = sequelize.define('Testimonial', {
  name: {
    type: DataTypes.STRING,
    allowNull: false 
  },
  quote: {
    type: DataTypes.TEXT,
    allowNull: false 
  },
  rating: {
    type: DataTypes.TINYINT.UNSIGNED, 
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  property: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'New Property'
  },
  verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => {
      const today = new Date();
      return today.toISOString().split('T')[0];
    }
  }
}, {
  tableName: 'testimonials',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Testimonial;