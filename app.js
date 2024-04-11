var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mysql = require('mysql');

var dbConnectionPool = mysql.createPool({ host: 'localhost', database: 'student_clubs' });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var clubsRouter = require('./routes/clubs');
var adminRouter = require('./routes/admin');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function (req, res, next) {
    req.pool = dbConnectionPool;
    next();
});

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'e6JY0PVjeVCImGxR8cSH',
    secure: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/clubs', clubsRouter);
app.use('/admin', adminRouter);

module.exports = app;
