const productsModel = require('../models/productsModel');

exports.index = async (req, res, next) => {
    // Get products from model
    const Desktops = await productsModel.getProductByType('Desktops', 4);
    const Hybrids = await productsModel.getProductByType('Hybrids', 4);
    const Tablets = await productsModel.getProductByType('Tablets', 3);
    res.render('index', { Desktops, Hybrids, Tablets, onHome: 'active'});
};