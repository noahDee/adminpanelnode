const db = require('../db/database')

const Cohort = db.sequelize.define('cohort', {
  name: db.Sequelize.STRING,
  course_id: db.Sequelize.INTEGER,
  startDate: db.Sequelize.DATEONLY,
  endDate: db.Sequelize.DATEONLY,
});

exports.Cohort =  Cohort;
