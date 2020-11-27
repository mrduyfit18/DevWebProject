const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/productsController');
/* GET list of books. */
router.get('/', productsController.index);

/* GET list of books. */
router.get('/:id', productsController.show);

module.exports = router;