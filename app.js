

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
const MemoryStore = require('memorystore')(session);
const url = require('url');
const cors = require('cors');


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
const APIRouter = require('./routes/api/api');
const activeRouter = require('./routes/activeAccount');
const forgotPasswordRouter = require('./routes/forgotPassword');
const checkoutRouter = require('./routes/checkout');
const recoverRouter = require('./routes/recover');
const guestsCartServices = require('./models/guestsCartServices');
const orderServices = require('./models/orderServices');




db.Connect();
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

//passport middleware
app.use(session({
    secret: process.env.SESSION_SECRET ,
    cookie: { maxAge: 360000000 },
    store: new MemoryStore({
        checkPeriod: 360000000
    }),
    saveUninitialized: true,
    resave: false,
})); //time live
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'))

app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});


app.use(async function (req, res, next) {
    if(req.user){
        res.locals.cart = await orderServices.getCart(req.user._id);
    }
    else {
        res.locals.cart = await guestsCartServices.getCart(req.cookies.cartID);
    }
    next();
});

app.use('/checkout', function (req, res, next) {
    if(!req.user){
        const notification = 'Bạn cần đăng nhập trước khi mua hàng';
        return res.render('notification', {notification});
    }
    next();
})

app.use('/users', function (req, res, next) {
    if(!req.user){
        const notification = 'Bạn cần đăng nhập khi đến đây';
        return res.render('notification', {notification});
    }
    next();
})

app.use('/recover', function (req, res, next) {
    if(!req.query.token){
        const notification = 'Yêu cầu không hợp lệ!!';
        return res.render('notification', { notification});
    }
    next();
})


app.get('/signout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.use('/recover', recoverRouter);
app.use('/forgot-password', forgotPasswordRouter);
app.use('/checkout', checkoutRouter);
app.use('/active', activeRouter);
app.use('/users', usersRouter);
app.use('/store', productsRouter);
app.use('/about', aboutRouter);
app.use('/faq', FAQRouter);
app.use('/gallery', galleryRouter);
app.use('/blog', blogRouter);
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);
app.use('/api', APIRouter);
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

hbs.registerHelper('convertPrice', function (index) {
    const moneyFormatter2 = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    });
    return moneyFormatter2.format(index);
});

hbs.registerHelper('totalProducts', function (cart) {
    if(cart) {
        return cart.listProducts.reduce(
            (accumulator, currentValue) => accumulator + currentValue.number
            , 0 );
    }
    return 0;
});

hbs.registerHelper('orderPrice', function (cart) {
    if(cart) {
        return cart.listProducts.reduce(
            (accumulator, currentValue) => accumulator + currentValue.number * currentValue.productID.basePrice
            , 0 );
    }
    return 0;
});

hbs.registerHelper('convertTime', function (date) {
    const currentDate = new Date();
    const second = (currentDate - date)/1000;
    if(second < 60) {
        return 'vừa xong';
    }
    else if(second < 3600){
        const min = Math.trunc(second/60);
        return min + ' phút trước';
    }
    else if(second < 86400){
        const hour = Math.trunc(second/3600);
        return hour +' giờ trước';
    }
    else{
        const day = Math.trunc(second / 86400);
        return day +' ngày trước';
    }
});

hbs.registerHelper('convertDate', function (date) {
    date = new Date((date.toLocaleString("en-US", {timeZone: 'Asia/Ho_Chi_Minh'})));
    return date.getDate()+ '/' + (date.getMonth()+1) + '/' +date.getFullYear();
});
hbs.registerHelper("eqOBJ", function(a, b, options) {
    if (a.toString() === b.toString()) {
        return options.fn(this);
    }
});

module.exports = app;
