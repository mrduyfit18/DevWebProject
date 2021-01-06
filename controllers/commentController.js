const querystring = require('querystring');
const mongoose = require('mongoose');
const buildUrl = require('build-url');

const commentModel = require('../models/commentModel');

exports.addComment = async (req, res, next)=>{
    await commentModel.addComment(req, await req.params._id);
};

