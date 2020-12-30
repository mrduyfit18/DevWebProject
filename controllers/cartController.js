const guestsCartServices = require('../models/guestsCartServices');

exports.addToCart = async (req, res, next) => {
    let cart;
    if( !req.user ){
        let cartID = req.cookies.cartID;
        cart = await  guestsCartServices.getCart(cartID);
        console.log(cart);
        if(cart) {
            const product = await cart.listProducts.find(product1 => req.query.productID == product1.productID._id);
            if (product) {
                cart = await guestsCartServices.increaseNumofProducts(cartID, req.query.productID, product.number + 1);

            }
        }
        else {
            cart = await guestsCartServices.addToCart(req.cookies.cardID, req.query.productID);
            res.cookie('cartID', cart._id);
        }
    }
    const cartProduct = cart.listProducts;
    res.json(cartProduct[cartProduct.length-1]);
}