'use strict';

// Express App
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const favicon = require('serve-favicon');
const passport = require('passport');
const jwt = require('jwt-simple');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Route Requires
const index = require('./routes/index');
const auth = require('./routes/auth');

// View Engine Setup (Handlebars)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(allowCrossDomain);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Use the passport package in our application
app.use(passport.initialize());

// App Routes
app.use('/auth', auth);
app.use('/', index);

// CORS Cross Domain
function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With'
  );

  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
