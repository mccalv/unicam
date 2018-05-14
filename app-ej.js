const express = require('express');
var partials      = require('express-partials');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');

var app = express();
// Require a module to connect to the database
var sqllite = require("./module/sqlite.js");

const admin_user = {
  user:"admin",
  password: "admin"
}

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());                        
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['username']
}))
var checkAuthentication =   function(req, res, next) {
    if (req.session && req.session.user)
    {
      next();
    }
    else
    {
      // user doesn't have access, return an HTTP 401 response
      res.redirect("/");
    }
  };


app.get('/', function (req, res) {
  sqllite.getStudents(function (students) {
    res.render('index', {
      user: "Great User",
      title: "homepage",
      "students": students
    });
  })
});

app.post('/login', function (req, res) {
  //console.log(req)
  user = req.body.username;
  password = req.body.password;
  console.log("user,password",user,password,admin_user.user,admin_user.password)
  session = req.session;
  console.log("session",session)

  if (user == admin_user.user && password == admin_user.password) {
    session.user = admin_user;
    console.log("is authenticated")
    res.redirect('/students');
  } else {
    res.redirect('/');
  }

});

app.get('/logout', function (req, res) {
  req.session.user=undefined;
  res.redirect('/');

});


app.get('/students',checkAuthentication,function (req, res) {
  var _id = req.query.id;
  sqllite.getStudents( function (students) {
    res.render('students', {
      "students": students
    });

  })

});

app.listen(3000, function () {
  console.log("Live at Port 3000");
});