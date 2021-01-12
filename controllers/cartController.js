const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const guestsCartServices = require('../models/guestsCartServices');
const orderServices = require('../models/orderServices');
const reserves = require('../models/mongooseModels/reservedProducts');


exports.addToCart = async (req, res, next) => {
    let cart;
    if( !req.user ) {
        const cartID = req.cookies.cartID;
        const productID = req.query.productID;
        cart = await guestsCartServices.addToCart(cartID, productID);
        if(!cartID || cartID !== cart.cartID) {
            res.cookie('cartID', cart._id, {  maxAge: 1800000});
        }
    }
    else{
        const productID = req.query.productID;
        if(req.query.delete){
            await reserves.findOneAndDelete({'user_id': req.user._id, 'product_id': productID});
        }
        cart = await orderServices.addToCart(res.locals.cart._id, productID);
    }
    await res.json(cart);
}

exports.increaseNumofProducts = async (req, res, next) => {
    const productID = req.params.productID;
    const newNum = Number(req.query.oldNum) + 1;
    if( !req.user ) {
        const cartID = req.cookies.cartID;
        if(!cartID){
            res.clearCookie('cartID');
            res.json("Giỏ hàng của bạn đã hết hạn!!");
        }
        else{
            await guestsCartServices.updateNumofProducts(cartID, productID, newNum);
            res.json('OK');
        }
    }
    else{
        const cartID = res.locals.cart._id;
        await orderServices.updateNumofProducts(cartID, productID, newNum);
        res.json('OK');
    }
}

exports.decreaseNumofProducts = async (req, res, next) => {
    const productID = req.params.productID;
    const newNum = req.query.oldNum - 1;
    if( !req.user ) {
        const cartID = req.cookies.cartID;
        if(!cartID){
            res.clearCookie('cartID');
            res.json("Giỏ hàng của bạn đã hết hạn!!");
        }
        else{
            await guestsCartServices.updateNumofProducts(cartID, productID, newNum);
            res.json('OK');
        }
    }
    else{
        const cartID = res.locals.cart._id;
        await orderServices.updateNumofProducts(cartID, productID, newNum);
        res.json('OK');
    }
}


exports.removeProduct = async (req, res, next) => {
    const productID = req.params.productID;
    if( !req.user ) {
        const cartID = req.cookies.cartID;
        if(!cartID){
            res.clearCookie('cartID');
            res.json("Giỏ hàng của bạn đã hết hạn!!");
        }
        else{
            console.log(productID);
            await guestsCartServices.removeProduct(cartID, productID);
            res.json('OK');
        }
    }
    else{
        const cartID = res.locals.cart._id;
        await orderServices.removeProduct(cartID, productID);
        res.json('OK');
    }
}

exports.reserveProduct = async (req, res, next) => {
    const productID = req.params.productID;
    const userID = req.user._id;
    const cartID = res.locals.cart._id;
    await orderServices.removeProduct(cartID, productID);
    await reserves.findOneAndUpdate({'user_id': ObjectId(userID), 'product_id': ObjectId(productID)},{},{upsert: true, new: true});
    res.json('OK');
}

exports.mergeCart = async (req, userID) =>{
    await orderServices.moveGuestCartToOrder(req.cookies.cartID, userID)
}