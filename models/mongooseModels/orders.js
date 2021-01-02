const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const order = new Schema({
        dateCreated: Schema.Types.Date         //Index to auto delete a doc after 3 days
    },
    {versionKey: false}
);

module.exports = mongoose.model('Order', order);