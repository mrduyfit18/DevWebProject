const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/productsController');




router.get('/', productsController.listAPI);
router.use('/', productsController.index);

module.exports = router;