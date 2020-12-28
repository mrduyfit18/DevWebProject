const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const passport = require('../passport/index');

router.post('/', passport.authenticate('local', { successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false })
);

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;