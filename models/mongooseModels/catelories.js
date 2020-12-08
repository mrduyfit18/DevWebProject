const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const mongoosePaginate = require('mongoose-paginate-v2');

const typeCategory = new Schema({
    _id: ObjectId,
    type: {type :new Schema({
            Desktops:ObjectId,
            Laptops: ObjectId,
            Tablets: ObjectId,
            Hybrids: ObjectId
        })
}
});

typeCategory.plugin(mongoosePaginate);
module.exports = mongoose.model('typeCategory', typeCategory);