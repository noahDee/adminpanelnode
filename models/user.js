const db = require('../db/database')
const bcrypt = require('bcrypt')

const User = db.sequelize.define('user', {
  name: db.Sequelize.STRING,
  password: db.Sequelize.STRING,
  email: db.Sequelize.STRING,
  education: db.Sequelize.INTEGER
}, {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    },
    instanceMethods: {
      validPassword: function(password) {
         return bcrypt.compareSync(password, this.password);
      }
    }
});
User.prototype.validPassword = function(password) {
     return bcrypt.compareSync(password, this.password);
  };

// exports.User = User;
module.exports = User;
