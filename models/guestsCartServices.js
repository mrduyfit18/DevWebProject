const {database} = require('../DAL/loadDatabase');
const mongoose=require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;

const guestsCarts = require('./mongooseModels/guestscarts');

exports.getCart = async (id) => {
    return guestsCarts.findOne({'_id': id}).populate('listProducts.productID');
}

exports.createCart = async (productID) => {
    const newCart = {
        listProducts: [{productID: productID, number: 1}],
        dateCreated: new Date()
    }
    await guestsCarts.insertMany(newCart);
    return guestsCarts.findOne({'type': newCart.type});
}

exports.addToCart = async (cartID, productID) => {
    const product = {productID: productID, number: 1};
    const dateCreated = new Date();
    const cart = await guestsCarts.findById(ObjectId(cartID));
    if(cart) {
        const currentProduct = await cart.listProducts.find(s => productID == s.productID._id);
        if (currentProduct) {
            const newNum = currentProduct.number + 1;
            return guestsCarts.findOneAndUpdate({'_id': ObjectId(cartID), 'listProducts.productID': ObjectId(productID)},
                {'$set': {'listProducts.$.number': newNum}}, {new: true, "upsert": true}).populate('listProducts.productID');
        }
    }

    return guestsCarts.findByIdAndUpdate(ObjectId(cartID),{ '$push': { 'listProducts': product },
        '$set': { 'dateCreated': dateCreated} }, { "new": true, "upsert": true }).populate('listProducts.productID');

}

exports.updateNumofProducts = async (cartID, productID, newNum) => {
    console.log(cartID, productID, newNum);
    return guestsCarts.findOneAndUpdate({'_id': ObjectId(cartID), 'listProducts.productID': ObjectId(productID)},
        {'$set': { 'listProducts.$.number': newNum}}, {new: true}).populate('listProducts.productID');
}

exports.removeProduct = async (cartID, productID) => {
    return guestsCarts.findByIdAndUpdate(ObjectId(cartID),{ '$pull': { 'listProducts':{ 'productID': ObjectId(productID)} }}).populate('listProducts.productID');
}