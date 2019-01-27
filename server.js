const express = require('express')
const app = express();
const port = 5050;
const bcrypt = require('bcrypt');
const User = require('./models/user.js');
// require('./models/user')
app.use(express.urlencoded( { extended: true}));
app.set('views', './views')
app.set('view engine', 'ejs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');

app.use(cookieParser());

app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});


// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        // next();
        res.redirect('/login')
    }
};

// app.[VERB]([PATH], function(req, res) { //what to do})

app.get('/', sessionChecker, (req, res) => {
  res.render('home');
});

app.get('/signup', sessionChecker, (req, res) => {
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
    }).then((user) => {
      req.session.user = user.dataValues;
      console.log(req.session);
      res.redirect('users')
    });
  });
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
});

app.get('/login', (req, res) => {
  res.clearCookie('user_sid');
  res.render('login');
});

app.post('/login', (req, res) => {
  let params = req.body
  var email = params.email,
   password = params.password;

  User.findOne({ where: { email: email } }).then(function(user) {
    if (!user) {
      res.redirect('/login')
    } else if (!user.validPassword(password)) {
      res.redirect('/login')
    } else {
      req.session.user = user.dataValues;
      res.redirect('/dashboard');
    }
  });
});

app.get('/dashboard', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    User.findOne({ where: { id: req.session.user.id} }).then(function (user) {
      console.log(req.session);
      res.render('users/show', {user: user});
    })
  }
});

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

// // Model definition
// const User = sequelize.define('user', {
//   name: Sequelize.STRING,
//   password: Sequelize.STRING,
//   email: Sequelize.STRING,
//   education: Sequelize.INTEGER
// });
//
// const Cohort = sequelize.define('cohort', {
//   name: Sequelize.STRING,
//   course_id: Sequelize.INTEGER,
//   startDate: Sequelize.DATEONLY,
//   endDate: Sequelize.DATEONLY,
// });
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
