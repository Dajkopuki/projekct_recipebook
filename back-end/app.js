var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const ajvModule = require("ajv").default;
const ajvFormatsModule = require('ajv-formats');
// Ajv
ajv = new ajvModule();
ajvFormatsModule(ajv);

// Routers definition
var indexRouter = require('./routes/index');
var videoRouter = require('./routes/video/main');
var categoryRouter = require('./routes/category/main');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes use
app.use('/', indexRouter);
app.use('/video', videoRouter);
app.use('/category', categoryRouter);

// Global DAO
daoConnect = require('./dao/connect');
daoCategoryAdd = require('./dao/category/add');
daoCategoryList = require('./dao/category/list');
daoVideoAdd = require('./dao/video/add');
daoVideoDel = require('./dao/video/delete');
daoVideoUpdate = require('./dao/video/update');
daoVideoSearch = require('./dao/video/search');

// catch 404 and forward to error handler
app.use(function(req, res) {
  res.statusCode = 404;
  res.json({"error": 404, "reason": "Page not found."});
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