const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');


router.post('/', usersController.Signin);

module.exports = router;