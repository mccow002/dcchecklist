var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./dist/server/routes/index');
//var users = require('./dist/server/routes/users');
var api = require('./dist/server/routes/pubapi');
var partials = require('./dist/server/routes/partials');
var seriesapi = require('./dist/server/routes/seriesapi');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/fontawesome', express.static(path.join(__dirname, '/node_modules/font-awesome')));
app.use('/bootstrap', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/templates', express.static(path.join(__dirname, '/templates')));

app.use('/', routes);
//app.use('/users', users);
app.use('/pubapi', api);
app.use('/partials', partials);
app.use('/seriesapi', seriesapi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
