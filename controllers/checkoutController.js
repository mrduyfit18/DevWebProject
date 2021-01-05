const productsModel = require('../models/productsModel');
const orderServices = require('../models/orderServices');
const contactsModel = require('../models/mongooseModels/contacts');

exports.index = async (req, res, next) => {

    res.render('store/checkout');
};

exports.getAddresses = async (req, res, next) => {
    const userID = req.user._id;
    const addresses = await contactsModel.find({'user_id': userID});
    res.json(addresses);
};

exports.changeAddress = async  (req, res, next) => {
    const newAddrID = req.body.id;
    const orderID = res.locals.cart._id;
    await orderServices.updateAddress(orderID, newAddrID);
    res.send('1');
}

exports.addAddress = async (req, res, next) => {
    const phoneNumber = req.body.phoneNumber;
    const address = req.body.address;
    const newAddr = await contactsModel.create({address: address, user_id: req.user.id, phone: phoneNumber, isMain: false});
    res.json(newAddr);
}