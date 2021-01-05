const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.post('/save', usersController.saveProfileChange);
router.get('/', usersController.edit);

router.post('/change-password', usersController.changePassword);


module.exports = router;
