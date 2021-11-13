const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const mongoose = require('mongoose');
const FileStore = require('session-file-store')(session);
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const multer = require('multer');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(session({
  secret:"강현구,권태호,김민후,김현,박승철,송재원,이정훈",
  resave:false,
  saveUninitialized:true,
  store: FileStore()
}))
app.use(multer({dest: 'uploads/'}).any());
app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

// connect to mongodb server


const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
  console.log("Connected to mongoDB server");
});

mongoose.connect('mongodb://localhost/user_data');

module.exports = app;
