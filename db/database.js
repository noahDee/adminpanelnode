const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'db/development.sqlite3'

});

module.exports = {
  sequelize, Sequelize
}
