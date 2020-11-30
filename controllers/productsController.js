const productsModel = require('../models/productsModel');

exports.index = async (req, res, next) => {
    // Get products from model
    const products = await productsModel.list();
    //console.log(products);
    // Pass data to view to display list of products
    res.render('store/products', { products, onStore: 'active'});
};

exports.Show = async (req, res, next) => {
    // Get product from model
    //await console.log(req.params._id);
    const product = await productsModel.getProduct(await req.params._id);
    res.render('store/productDetail', {product});
};