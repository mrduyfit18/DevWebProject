const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/productsController');
const cartsController = require('../../controllers/cartController');


router.get('/products', productsController.indexAPI);

router.get('/add-to-cart', cartsController.addToCart);

module.exports = router;