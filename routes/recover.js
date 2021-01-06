const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/:email', function (req, res, next) {
    res.render('recover');
});

router.post('/:email/submit', usersController.recoverPassword);
module.exports = router;