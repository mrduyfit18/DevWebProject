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
    return guestsCarts.findByIdAndUpdate(ObjectId(cartID),{ '$push': { 'listProducts': product },
        '$set': { 'dateCreated': dateCreated} }, { "new": true, "upsert": true }).populate('listProducts.productID');

}

exports.increaseNumofProducts = async (cartID, productID, newNum) => {
    return guestsCarts.findOneAndUpdate({'_id': ObjectId(cartID), 'listProducts.productID': ObjectId(productID)}, {'$set': { 'listProducts.$.number': newNum}})
}