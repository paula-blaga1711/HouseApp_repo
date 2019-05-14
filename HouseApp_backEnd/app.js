var express = require('express');
global.app = express();
app.disable('etag').disable('x-powered-by');
const bodyParser = require('body-parser');

var path = require('path');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/resources', express.static(path.join(__dirname, '/resources')));

require('./config/db');
require('./routes/routes');

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      status: "error",
      message: err.message
    })
  });
  
  
  app.listen(5000);


module.exports = app;
