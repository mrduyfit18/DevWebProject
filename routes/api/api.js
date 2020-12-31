const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/productsController');
const cartsController = require('../../controllers/cartController');

router.get('/cart/:productID/increase', cartsController.increaseNumofProducts);
router.get('/cart/:productID/decrease', cartsController.decreaseNumofProducts);
router.get('/cart/:productID/remove', cartsController.removeProduct);

router.get('/products', productsController.indexAPI);

router.get('/add-to-cart', cartsController.addToCart);



module.exports = router;