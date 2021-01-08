const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/orders/:id', usersController.getOrderDetail);

router.post('/save', usersController.saveProfileChange);
router.get('/edit', usersController.edit);

router.post('/change-password', usersController.changePassword);


router.get('/orders', usersController.getOrders);

router.get('/reserves', usersController.getReserves);



module.exports = router;
