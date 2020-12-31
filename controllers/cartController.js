const guestsCartServices = require('../models/guestsCartServices');

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
    res.json(cart);
}

exports.increaseNumofProducts = async (req, res, next) => {
    if( !req.user ) {
        const cartID = req.cookies.cartID;
        const productID = req.params.productID;
        const currentNum = Number(req.query.oldNum) + 1;
        console.log(currentNum);
        if(!cartID){
            res.clearCookie('cartID');
            res.json("Giỏ hàng của bạn đã hết hạn!!");
        }
        else{
            await guestsCartServices.updateNumofProducts(cartID, productID, currentNum);
            res.json('OK');
        }
    }
}

exports.decreaseNumofProducts = async (req, res, next) => {
    if( !req.user ) {
        const cartID = req.cookies.cartID;
        const productID = req.params.productID;
        const currentNum = req.query.oldNum - 1;
        if(!cartID){
            res.clearCookie('cartID');
            res.json("Giỏ hàng của bạn đã hết hạn!!");
        }
        else{
            await guestsCartServices.updateNumofProducts(cartID, productID, currentNum);
            res.json('OK');
        }
    }
}


exports.removeProduct = async (req, res, next) => {
    if( !req.user ) {
        const cartID = req.cookies.cartID;
        const productID = req.params.productID;
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
}