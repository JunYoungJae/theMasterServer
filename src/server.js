const express = require('express');
const app = express();
require('express-async-errors');
const pg = require('./DB/pg');
const db = require('./models/sequelize-models');
const { APP_PORT } = process.env;
const { generateFakeData } = require('./faker');

const routers =  require('./routes');

const server = async () => {
  try {
    if (!APP_PORT) throw new Error('Please add .env file. Thanks');

    await pg.connectDB();
    try {
      await db.sequelize.sync({
        force: false,
      });
    } catch (error) {
      console.log('#sequelize Error');
      console.log(error);
    }
    
    app.use(express.json());

    app.use('/api', require('./routes'));
    app.use('/api/review', require('./routes/reviewRoute'));
    app.use('/api/service', require('./routes/serviceRoute'));
    app.use('/api/quot', require('./routes/quotRoute'));
    app.use('/api/categoryService', require('./routes/categoryServiceRoute'));
    app.use(require('./middlewares/error'));

    // Server Port
    app.listen(APP_PORT, () => {
      console.log(`Server listen on port ${APP_PORT}`);
    });
  } catch (err) {
    console.log('Fail Server starting !!!');
    console.log('err', err);
  }
};

server();
