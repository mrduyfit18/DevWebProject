const {database} = require('../DAL/loadDatabase');
const mongoose=require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const manufacturer = require('./mongooseModels/manufacturers');

exports.list = async ()=>{
    return manufacturer.find({});
}