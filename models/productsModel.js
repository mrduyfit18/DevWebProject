const {database} = require('../DAL/loadDatabase');
const ObjectId = require('mongodb').ObjectId;
//let listProducts;

// exports.Init = async () => {
//     listProducts = await db.Connect();
// }


exports.list = async () => {
    const collection = await database().collection('Products');
    let result =  await collection.find({});
    return await result.toArray().then();
}

exports.getProduct = async (id) => {
    const productsCollection = database().collection('Products');
    const detailsCollection = database().collection('Detail');
    const product = await productsCollection.findOne({'_id': ObjectId(id)});
    const productDetail = await detailsCollection.findOne({'_id': ObjectId(id)});
    return await Object.assign(product,productDetail);
}

exports.getProductByType = async (type) =>{
    const collection = database().collection('Products');
    let result =  await collection.find({'type': type});
    return await result.toArray().then();
}

exports.getProductByTypeAndNumber = async (type, number) =>{
    const collection = database().collection('Products');
    let result =  await collection.find({'type': type}).limit(number);
    return await result.toArray().then();
}
