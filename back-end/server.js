require('dotenv').config();
const express = require('express');
const App = express();
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database'); 
const index = require('./routers/index');

App.use(cors({ origin: '*' }));
App.set('view engine', 'ejs');
App.set('views', __dirname + '/views');
App.set('layout', 'layouts/layout');
App.use(expressLayouts);
App.use(express.static('public'));
App.use(express.json());
App.use("/uploads", express.static(path.join(__dirname, "uploads")));

App.use('/', index);

// ✅ Sync all models (like Mongoose schema)
sequelize.sync({ alter: false })
  .then(() => console.log('✅ All MySQL models synced'))
  .catch(err => console.error('❌ Sync error:', err));

const PORT = process.env.PORT || 8080;
App.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
