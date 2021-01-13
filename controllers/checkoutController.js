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
    const isMain = !(req.user.contacts === true);
    const user_id = req.user._id;
    await orderServices.updateAddress(orderID, newAddrID, isMain, user_id);
    res.send('1');
}

exports.addAddress = async (req, res, next) => {
    const phoneNumber = req.body.phoneNumber;
    const address = req.body.address;
    const isMain = !(req.user.contacts);
    console.log(isMain);
    const newAddr = await contactsModel.create({address: address, user_id: req.user.id, phone: phoneNumber, isMain: isMain});
    if(isMain){
        const orderID = res.locals.cart._id;
        const contactID = newAddr._id;
        await orderServices.updateAddress(orderID, contactID);
    }
    res.json(newAddr);
}

exports.submit = async (req, res, next) => {
    const userID = req.user._id;
    const mainContact = req.user.contacts.find(s => s.isMain === true );
    const orderID = res.locals.cart._id;
    const totalCost = await res.locals.cart.listProducts.reduce(
        (accumulator, currentValue) => accumulator + currentValue.number * currentValue.productID.basePrice
        , 0 );
    await orderServices.checkout(orderID, totalCost);
    await orderServices.createCart(userID, mainContact._id);
    res.send('OK');
}