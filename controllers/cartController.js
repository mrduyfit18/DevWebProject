const guestsCartServices = require('../models/guestsCartServices');
const orderServices = require('../models/orderServices');

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

exports.mergeCart = async (req, userID) =>{
    await orderServices.moveGuestCartToOrder(req.cookies.cartID, userID)
}