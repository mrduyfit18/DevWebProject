const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.post('/:id/save', usersController.saveProfileChange);
router.get('/:id', usersController.edit);


module.exports = router;
