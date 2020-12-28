

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config({ path: '.env' });
const hbshelpers = require('handlebars-helpers');
const helpers = hbshelpers();
const session = require("express-session"),
    bodyParser = require("body-parser");

const db = require('./DAL/loadDatabase');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// const signinRouter = require('./routes/signin');
// const signupRouter  = require('./routes/signup');
const productsRouter = require('./routes/store/products');
const aboutRouter = require('./routes/about');
const FAQRouter = require('./routes/faq');
const galleryRouter = require('./routes/gallery');
const blogRouter = require('./routes/blog/blog');
const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');
const passport = require('./passport');
const productsAPIRouter = require('./routes/api/productsAPI');

db.Connect();
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//passport middleware
app.use(session({ secret: process.env.SESSION_SECRET , cookie: { maxAge: 360000000 }})); //time live
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});



app.use('/users', usersRouter);
app.use('/store', productsRouter);
app.use('/about', aboutRouter);
app.use('/faq', FAQRouter);
app.use('/gallery', galleryRouter);
app.use('/blog', blogRouter);
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);
app.use('/api/products', productsAPIRouter);
app.use('/', indexRouter);



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

const hbs = require('hbs');
hbs.registerPartials(path.join(__dirname,'views','partials'));
hbs.registerHelper(helpers);
hbs.registerHelper('incremented', function (index) {
  index+=2;
  return index;
});


module.exports = app;
