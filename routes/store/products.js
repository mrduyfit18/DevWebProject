const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/productsController');

router.get('/:_id', productsController.Show);
router.get('/', productsController.index);


module.exports = router;