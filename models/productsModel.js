const db = require('../DAL/loadDatabase');
//let listProducts;

// exports.Init = async () => {
//     listProducts = await db.Connect();
// }

exports.list = async () => {
    return await db.GetAll().then();
}

exports.getProduct = async (id) => {
    //console.log(id);
    return await db.getFromDB(id).then();
}

