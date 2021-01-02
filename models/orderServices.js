const {database} = require('../DAL/loadDatabase');
const mongoose=require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;

const guestsCarts = require('./mongooseModels/guestscarts');
const Orders = require('./mongooseModels/orders');

exports.moveGuestCartToOrder = async (guestCartID) => {
    const cart = await guestsCarts.findOne(guestCartID);
    for(let product of cart.listProducts) {

    }
}





