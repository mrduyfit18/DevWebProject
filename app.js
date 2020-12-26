

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config({ path: '.env' });

const db = require('./DAL/loadDatabase');
const hbshelpers = require('handlebars-helpers');
const helpers = hbshelpers();
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
//passport
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/users', usersRouter);
app.use('/store', productsRouter);
app.use('/about', aboutRouter);
app.use('/faq', FAQRouter);
app.use('/gallery', galleryRouter);
app.use('/blog', blogRouter);
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);
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


module.exports = app;
