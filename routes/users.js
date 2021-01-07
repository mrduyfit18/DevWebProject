const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/orders/:id', usersController.getOrderDetail);

router.post('/save', usersController.saveProfileChange);
router.get('/', usersController.edit);

router.post('/change-password', usersController.changePassword);


router.all('/orders', usersController.getOrders);



module.exports = router;
