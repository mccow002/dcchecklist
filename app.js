var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var io = require('socket.io');

var comicReaderSockets = require('./dist/server/sockets/comicreadersocket');

var Config = require('./dist/server/config');

var app = express();

var io = io();
app.io = io;

io = io.sockets.on('connection', function(socket){
  console.log('a user connected');

  var sockets = new comicReaderSockets();
  socket.on('getPage', function(data) {
    sockets.GetPage(data, socket);
  });
});

var routes = require('./dist/server/routes/index');
//var users = require('./dist/server/routes/users');
var api = require('./dist/server/routes/pubapi');
var partials = require('./dist/server/routes/partials');
var seriesapi = require('./dist/server/routes/seriesapi');
var issuesapi = require('./dist/server/routes/issuesapi');
var readerapi = require('./dist/server/routes/comicreader')(io);

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
app.use('/toastr', express.static(path.join(__dirname, '/node_modules/angular-toastr/dist')));
app.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/treecontrol', express.static(path.join(__dirname, 'node_modules/angular-tree-control')));
app.use('/angular', express.static(path.join(__dirname, 'node_modules/angular')));

app.use('/', routes);
//app.use('/users', users);
app.use('/pubapi', api);
app.use('/partials', partials);
app.use('/seriesapi', seriesapi);
app.use('/issuesapi', issuesapi);
app.use('/readerapi', readerapi);

//connect to mongodb
// console.log(Config.DbConnection);
mongoose.connect(Config.DbConnection);
// app.locals.db = mongoose.connect(Config.DbConnection);

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
