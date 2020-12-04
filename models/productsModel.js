const {database} = require('../DAL/loadDatabase');
const mongoose=require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Products = require('./mongooseModels/products');

exports.list = async () => {
    return Products.find({});
}

exports.getProduct = async (id) => {
    return Products.findOne({'_id': ObjectId(id)});
}

exports.getProductByType = async (type) =>{
    return Products.find({'type': type});
}

exports.getProductByTypeAndNumber = async (type, number) =>{
    //const collection = database().collection('Products');
    return Products.find({'type': type}).limit(number);
}
