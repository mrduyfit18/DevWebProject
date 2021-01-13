const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const contact = new Schema({
        _id: ObjectId,
        user_id: {type: Schema.Types.ObjectId, ref: 'Account' },
        address: String,
        phone: String,
        isMain: Boolean
    },
    {versionKey: false}
);

module.exports = mongoose.model('Contact', contact);