const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const mongoosePaginate = require('mongoose-paginate-v2');

const  comment = new Schema({
    _id: ObjectId,
    name: String,
    product_id: ObjectId,
    content: String,
    date: Date
});

comment.plugin(mongoosePaginate);
module.exports = mongoose.model('comment', comment);