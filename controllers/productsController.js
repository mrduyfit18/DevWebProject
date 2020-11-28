const productsModel = require('../models/productsModel');

exports.index = (req, res, next) => {
    // Get products from model
    const products = productsModel.list();
    // Pass data to view to display list of books
    res.render('store/products', { products, onStore: 'active'});
};

exports.show = (req, res, next) => {
    // Get product from model
    const product = productsModel.getProduct(req.params.id);
    // Pass data to view to display list of books
    res.render('store/productDetail', {product});
};