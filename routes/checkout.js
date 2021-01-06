const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

router.get('/', checkoutController.index);
router.get('/get-addresses', checkoutController.getAddresses);
router.post('/submit', checkoutController.submit);

module.exports = router;