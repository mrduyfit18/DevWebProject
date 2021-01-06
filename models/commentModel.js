const {database} = require('../DAL/loadDatabase');
const mongoose=require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const comment = require('./mongooseModels/comments')

exports.listCmt = async (id) => {
    return comment.find({'product_id' :ObjectId(id)});
};

exports.addComment = async (req, id) => {
    let name;
    console.log(req.session.name);
    if(req.session._id){
        name =req.session.user.name;
    }
    else{
        name = req.body.new_comment_name
    }
    let newComment = ({
        name : name,
        product_id : id,
        content : req.body.new_comment_text,
        date : new Date()
    });

    comment.insertMany(newComment).then((doc)=>{})
        .then((err)=>{console.log(err);});

    return true;
};