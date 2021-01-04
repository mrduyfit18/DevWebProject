const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/productsController');



router.post('/:_id', productsController.addComment);
router.get('/:_id', productsController.Show);
router.use('/', productsController.index);


module.exports = router;