const {database} = require('../DAL/loadDatabase');
const mongoose=require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;

const guestsCarts = require('./mongooseModels/guestscarts');
const orders = require('./mongooseModels/orders');
const details = require('./mongooseModels/orderDetails');
const contacts = require('./mongooseModels/contacts');

exports.moveGuestCartToOrder = async (guestCartID, userID) => {
    const cart = await guestsCarts.findById(guestCartID);
    const userCart = await orders.findOneAndUpdate({'user_id': userID, 'status': 'cart'},
        {'$set': {'dateModified': new Date()}},
        { upsert: true, new: true });
    let listProducts = [];
    if(cart && cart.listProducts) {
        for (let product of cart.listProducts) {
            await details.updateOne({'product_id': product.productID, 'order_id': userCart._id},
                {'$inc': { 'number': product.number }},
                {upsert: true, new: true});
        }
    }
    else{
        // do nothing
    }
}

exports.getCart = async (userID) => {
    return orders.findOne({'user_id': userID, 'status': 'cart'}).populate({
        path : 'listProducts',
        populate : {
            path : 'productID'
        }
    });
}

exports.addToCart = async (cartID, productID) => {
    const cartProducts = await details.find({'order_id': cartID});

    const currentProduct = await cartProducts.find(s => productID === s.product_id.toString());

    if (currentProduct) {
        const newNum = currentProduct.number + 1;
        await details.updateOne({'product_id': productID, 'order_id': currentProduct.order_id}, {'number': newNum})
    }
    else {
        await details.insertMany([{
            product_id: ObjectId(productID),
            order_id: cartID,
            number: 1
        }]);
    }
    return orders.findOne({'_id': cartID, 'status': 'cart'}).populate({
        path : 'listProducts',
        populate : {
            path : 'productID'
        }
    });
}

exports.updateNumofProducts = async (cartID, productID, newNum) => {
    await details.updateOne({'order_id': cartID, 'product_id': productID}, {'$set': {'number': newNum}});
}

exports.removeProduct = async (cartID, productID) => {
    await details.deleteOne(({'order_id': cartID, 'product_id': productID}));
}

exports.updateAddress = async (orderID, addressID) => {
    await orders.updateOne({'_id': orderID}, {'$set': {'contact_id': addressID}});
}

//Tạo giỏ hàng mới cho user khi thanh toán giỏ hàng trước
exports.createCart = async (userID, contactID) => {
    await orders.create({user_id: userID, contact_id: contactID, status: 'cart', dateModified: new Date()});
}

exports.checkout = async (orderID, totalCost) => {
    await orders.findByIdAndUpdate(ObjectId(orderID), {'$set': {'status': 'đang xử lý', 'dateModified': new Date(), 'totalCost': totalCost}});
}

exports.getOrdersOfUser = async (userID) => {
    return orders.find({'user_id': ObjectId(userID), 'status': {'$ne': 'cart'}}).populate({
        path : 'listProducts',
        populate : {
            path : 'productID'
        }
    });
}


exports.getOrder= async (id) => {
    return orders.findById(ObjectId(id)).populate('user_id').populate('contact_id').populate({
        path : 'listProducts',
        populate : {
            path : 'productID',
            populate:{
                path : 'manufacturer_id',
            }
        }
    });
}