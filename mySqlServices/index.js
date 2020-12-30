const Sequelize = require('sequelize');


const dotenv = require('dotenv');

dotenv.config({
  path: '././config.env',
});

// connect to Mysql database in Cloud server
const sequelize = new Sequelize(process.env.LOC_MYSQL_DATABASE,
  process.env.LOC_MYSQL_USER,
  process.env.LOC_MYSQL_PASSWORD, {
    host: process.env.LOC_MYSQL_HOST,
    dialect: 'mysql',
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = { db };
