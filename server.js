const express = require('express')
const app = express();
const port = 5050;

app.use(express.urlencoded( { extended: true}));
app.set('views', './views')
app.set('view engine', 'ejs');

const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'development.sqlite3'
  //
  // pool: {
  //   max: 5,
  //   min: 0,
  //   acquire: 30000,
  //   idle: 10000
  // },

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  // operatorsAliases: false
});

// app.[VERB]([PATH], function(req, res) { //what to do})

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/signup', (req, res) => {
  res.render('users/new');
});

app.post('/users', (req, res) => {
  let params = req.body
  User.sync({force: false}).then(() => {
    // Table created
    return User.create({
      name: params.name,
      password: params.password,
      email: params.email,
      education: params.education
    });
  });
  res.redirect('users')
})

app.get('/users', (req, res) => {
  let users = []
  User.all().then((user) => {
    for (u of user) {
      users.push(u)
    }
  }).then(() => {
    res.render('users/index', {users: users})
})
})

app.get('/new-cohort', (req, res) => {
  res.render('cohorts/new');
});

app.post('/cohorts', (req, res) => {
    let params = req.body
    Cohort.sync({force: false}).then(() => {
      // Table created
      return Cohort.create({
        name: params.name,
        startDate: params.startDate,
        endDate: params.endDate,
        course_id: params.course_id
      });
    });
    res.redirect('cohorts')
});

app.get('/cohorts', (req, res) => {
  let cohorts = []
  Cohort.all().then((cohort) => {
    for (c of cohort) {
      cohorts.push(c)
    }
  }).then(() => {
    res.render('cohorts/index', {cohorts: cohorts})
})
})

app.get('/new-course', (req, res) => {
  res.render('courses/new');
});

// Model definition
const User = sequelize.define('user', {
  name: Sequelize.STRING,
  password: Sequelize.STRING,
  email: Sequelize.STRING,
  education: Sequelize.INTEGER
});

const Cohort = sequelize.define('cohort', {
  name: Sequelize.STRING,
  course_id: Sequelize.INTEGER,
  startDate: Sequelize.DATEONLY,
  endDate: Sequelize.DATEONLY,
});
//  create function
// force: true will drop the table if it already exists
// User.sync({force: false}).then(() => {
//   // Table created
//   return User.create({
//     name: params.name,
//     password: params.password,
//     email: params.email,
//     education: params.education
//   });
// });

app.listen(port, () => { console.log(`Express app listening for 50-50's on port ${port}`);})
