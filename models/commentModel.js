const {database} = require('../DAL/loadDatabase');
const mongoose=require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const comment = require('./mongooseModels/comments')

exports.listCmt = async (id, page) => {
    return comment.paginate({'product_id' :ObjectId(id)}, {limit: 3, page:page, sort:{'date':-1}, new: true});
};

exports.addComment = async (name, content, productID) => {

    let newComment = ({
        name : name,
        product_id : ObjectId(productID),
        content : content,
        date : new Date()
    });

    comment.insertMany(newComment).then((doc)=>{})
        .then((err)=>{console.log(err);});

    return true;
};