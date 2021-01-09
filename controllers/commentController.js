const commentModel = require('../models/mongooseModels/comments');
const commentService = require('../models/commentModel');

exports.getComment = async (req, res, next)=>{
    const productID = req.query.productID;
    const page = req.query.page;
    const comments = await commentService.listCmt(productID, page);
    res.render('store/comment', {layout: false, comments});
}

exports.addComment = async (req, res, next)=>{
    const name = req.body.name;
    const content = req.body.content;
    const productID = req.body.productID;
    await commentService.addComment(name, content, productID);
    setTimeout(async ()=>{
        const comments = await commentService.listCmt(productID, 1);
        return res.render('store/comment', {layout: false, comments});
    },500);

};

