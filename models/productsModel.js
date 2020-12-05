const {database} = require('../DAL/loadDatabase');
const mongoose=require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Products = require('./mongooseModels/products');

exports.list = async (currentPage) => {
    const currPage = currentPage || 1;
    const res = await Products.paginate({}, {page: currPage, limit: 2});

    if(res.hasNextPage){
        const secondPaging = await Products.paginate({}, {page:  res.nextPage, limit: 2});
        if(secondPaging.hasNextPage){
            res.secondNextPage = secondPaging.nextPage;
        }
    }

    if(res.hasPrevPage){
        const secondPaging = await Products.paginate({}, {page: res.prevPage, limit: 2});
        if(secondPaging.hasPrevPage){
            res.secondPrevPage = secondPaging.prevPage;
        }
    }
    return res;
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
