const commentModel = require('../models/commentModel');


exports.addComment = async (req, res, next)=>{
    console.log(req.body.name);
    const newComment = await commentModel.addComment(req, await req.params._id);

    res.json(newComment);
};

