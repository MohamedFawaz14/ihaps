require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.BASE_DATABASE,
  process.env.BASE_USER,
  process.env.BASE_PASSWORD,
  {
    host: process.env.BASE_URL,
    port: process.env.BASE_PORT || 21013,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false  
      }
    }
  }
);

sequelize.authenticate()
  .then(() => console.log('✅ Connected to MySQL successfully...'))
  .catch(err => console.error('❌ Failed to connect to MySQL:', err));

module.exports = sequelize;
