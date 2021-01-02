const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const detail = new Schema({
        productID: ObjectId,
        number: Number
    },
    {versionKey: false}
);

module.exports = mongoose.model('Orderdetail', detail);