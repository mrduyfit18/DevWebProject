const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const cartController = require('../controllers/cartController');
const passport = require('../passport/index');
const path = require('path');
const appRoot = require('app-root-path');


// router.post('/', passport.authenticate('local', { successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true })
// );
router.post('/', function(req, res, next) {
    passport.authenticate('local', function(error, user, info) {
        if (error) { return next(error); }
        if (!user||user===-1) { return res.send(info.message); }
        req.logIn(user, async function(err) {
            if (err) { return next(err); }
            if(user.type==='admin'){
                res.cookie('id', user._id);
                return res.send('2');
            }
            await cartController.mergeCart(req, user._id);
            res.clearCookie('cartID');
            return res.send('1');
        });

    })(req, res, next);
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get('/google/callback',
    function(req, res, next) {
        passport.authenticate('google', function(error, user, info) {
            if (error) { return next(error); }
            if (!user||user===-1) { return res.send(info.message); }
            req.logIn(user, async function(err) {
                if (err) { return next(err); }
                if(user.type==='admin'){
                    res.cookie('id', user._id);
                    return res.send('2');
                }
                await cartController.mergeCart(req, user._id);
                res.clearCookie('cartID');
                const options = {
                    root: appRoot + '/public'
                }
                return res.sendFile('loading.html', options);
            });

        })(req, res, next);
    });

router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/', successRedirect: '/'})
);


module.exports = router;
