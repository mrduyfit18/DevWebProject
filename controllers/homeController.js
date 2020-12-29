const productsModel = require('../models/productsModel');

exports.index = async (req, res, next) => {
    // Get products from model
    const Desktops = await productsModel.getProductByTypeAndNumber('Desktops',3);
    const Laptops = await productsModel.getProductByTypeAndNumber('Laptops',4);
    res.render('index', { Desktops, Laptops, onHome: 'active'});
};