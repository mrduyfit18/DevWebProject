const {database} = require('../DAL/loadDatabase');
const mongoose=require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Products = require('./mongooseModels/products');
const Manufacturers = require('./mongooseModels/manufacturers');
const productImage = require('./mongooseModels/productImages');
const comment = require('./mongooseModels/comments')

exports.list = async (filter, currentPage, sortOption) => {
    const currPage = currentPage || 1;
    const res = await Products.paginate(filter, {page: currPage, limit: 6, populate: 'manufacturer_id', sort: sortOption});

    if(res.hasNextPage){
        const secondPaging = parseInt(res.nextPage) + 1;
        if(secondPaging <= res.totalPages){
            res.secondNextPage = secondPaging;
        }
    }
    // const a = await Products.aggregate([
    //     {
    //         $lookup: {
    //             from: 'manufacturers',
    //             localField: 'manufacturer_id',
    //             foreignField: '_id',
    //             as: 'manufacturer'
    //         }
    //     },
    //     {
    //         $match:{
    //             'manufacturer.name': 'MSI'
    //         }
    //     },
    //     {
    //         $unwind: '$manufacturer'
    //     }
    // ]);
    // console.log(a);
    if(res.hasPrevPage){
        const secondPaging = parseInt(res.prevPage) - 1;
        if(secondPaging >= 1){
            res.secondPrevPage = secondPaging;
        }
    }
    return res;

}

exports.getProduct = async (id) => {
    const product = await Products.findOne({'_id': ObjectId(id)}).populate('manufacturer_id');
    product.productImages = await productImage.find({'product_id': ObjectId(id)});
    return product;
}

exports.getProducts = async (filter) => {
    return Products.find(filter).populate('manufacturer_id');
}

exports.getProductByType = async (type) =>{
    //return Products.populate().find({type: type});
}

exports.getProductByTypeAndNumber = async (type, number) =>{
    //const collection = database().collection('Products');
    return  Products.find({'type': type }).limit(number);
}

exports.Search = async (text) => {
    return Products.find(
        { 'name': { "$regex": text, "$options": "i" } }
    );
}

exports.getRelatedProduct = async (manufacturer, id) =>{

    return Products.find({'manufacturer_id': manufacturer, '_id': { '$ne': id}}).limit(4);
}
