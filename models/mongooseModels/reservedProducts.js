//Dùng để lưu trữ những sản phẩm mua sau cho 1 khách hàng

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const product = new Schema({
        product_id: ObjectId,
        user_id: {type: Schema.Types.ObjectId, ref: 'Account' },
    },
    {versionKey: false}
);

product.virtual('productID', {
    ref: 'Product',
    localField: 'product_id',
    foreignField: '_id',
    justOne: true

});
product.set('toObject', { virtuals: true });
product.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Reservedproduct', detail);