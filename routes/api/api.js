const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/productsController');
const cartsController = require('../../controllers/cartController');
const checkoutController = require('../../controllers/checkoutController');
const commentController = require('../../controllers/commentController');

router.get('/cart/:productID/increase', cartsController.increaseNumofProducts);
router.get('/cart/:productID/decrease', cartsController.decreaseNumofProducts);
router.get('/cart/:productID/remove', cartsController.removeProduct);

router.get('/products', productsController.indexAPI);

router.get('/add-to-cart', cartsController.addToCart);

router.post('/checkout/change-address', checkoutController.changeAddress);

router.post('/contacts/add', checkoutController.addAddress);

router.post('/addComment', commentController.addComment);


module.exports = router;