const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const passport = require('../passport/index');

// router.post('/', passport.authenticate('local', { successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true })
// );
router.post('/', function(req, res, next) {
    passport.authenticate('local', function(error, user, info) {
        if (error) { return next(error); }
        if (!user||user===-1) { return res.send(info.message); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.send('1');
        });

    })(req, res, next);
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/', successRedirect: '/'})
);


module.exports = router;