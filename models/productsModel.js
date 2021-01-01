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

exports.listCmt = async (id) => {
    return comment.find({'product_id' :ObjectId(id)});
};

exports.addComment = (req, id) => {

    let newComment = ({
        name : req.body.new_comment_name,
        product_id : id,
        content : req.body.new_comment_text,
        date : new Date()
    });
    console.log(id);
    console.log(req.body.new_comment_name);
    console.log(req.body.new_comment_text);

    comment.insertMany(newComment).then((doc)=>{})
        .then((err)=>{console.log(err);});
};