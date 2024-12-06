var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2');

// Creates connection to the database:
var connection = mysql.createConnection({
  host: 'localhost', // Database host.
  user: 'root', // MySQL username.
  password: '', // MySQL password.
  database: 'comp206' // Database name.
});

// Connect to MySQL database:
connection.connect(function(err) {
  if(err)
  {
    console.error('ERROR. Could not connect: ' + err.stack);
    return;
  }
  console.log('Connected to database as ID: ' + connection.threadId);
});

var indexRouter = require('./routes/index');
var todolistRouter = require('./routes/todolist'); 

var app = express();

// View engine setup:
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/todos', todolistRouter);

// Catch 404 and forawrd to error handler:
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler:
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Closing the MySQL connection when app is terminated:
process.on('SIGINT', () => {
  connection.end(function(err) {
    if(err)
    {
      console.error('ERROR. Could not end connection. ' + err.stack);
      return;
    }
    console.log('Connection to database ended.');
    process.exit();
  });
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Server is running on PORT: ' + port);
});

module.exports = app;