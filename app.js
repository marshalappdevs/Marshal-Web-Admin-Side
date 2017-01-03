var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport  = require('passport');
var jwt = require('jsonwebtoken');
var routes = require('./routes/index');

var app = express();

// Just checking

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'node_modules')));
app.use('/', routes);

// Load the strategy
require('./config/passport')(passport);
require('./config/passportAdmin')(passport);
require('./config/passportLogin')(passport);


routes.get('/', passport.authenticate('jwtLogin', { session: false, failureRedirect: '/login#?msg=np' }), function(req, res, next) {
  res.sendFile(path.join(__dirname + '/public/home.html'));
});

routes.get('/login', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/public/login.html'));
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.message, err, req.originalUrl);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.end();
  console.log(err.message, err, req.originalUrl);
});

module.exports = app;
