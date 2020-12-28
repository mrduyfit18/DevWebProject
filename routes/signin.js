const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const passport = require('../passport/index');

router.post('/', passport.authenticate('local', { successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false })
);
// router.post('/', function(req, res, next) {
//     passport.authenticate('local', function(error, user, info) {
//         if(error) {
//             return res.json(error);
//         }
//         if(!user) {
//             return res.json('fsafafa');
//         }
//         res.redirect('/');
//     })(req, res, next);
// });

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;