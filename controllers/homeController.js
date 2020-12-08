const productsModel = require('../models/productsModel');

exports.index = async (req, res, next) => {
    // Get products from model
    const Desktops = await productsModel.getProductByTypeAndNumber('Desktops',4);
    const Hybrids = await productsModel.getProductByTypeAndNumber('Hybrids',3);
    const Tablets = await productsModel.getProductByTypeAndNumber('Tablets',3);
    const status = true;
    res.render('index', { Desktops, Hybrids, Tablets, onHome: 'active', status});
};