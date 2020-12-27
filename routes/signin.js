const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const passport = require('../passport/index');

router.post('/', passport.authenticate('local', { successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true })
);

module.exports = router;