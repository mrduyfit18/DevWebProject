const {database} = require('../DAL/loadDatabase');
const mongoose=require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const typeCategory = require('./mongooseModels/catelories');

exports.typeCatalog = async (type)=>{
    //return typeCategory.find({'type' : mongoose.Types.Array.of(type).}:{});
}