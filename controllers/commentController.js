const commentModel = require('../models/mongooseModels/comments');
const commentService = require('../models/commentModel');


exports.addComment = async (req, res, next)=>{
    const newComment = await commentService.addComment(req, await req.params._id);

    res.json(newComment);
};

