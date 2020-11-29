const MongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectId;
// Connection URI
const uri ='mongodb+srv://mrduyfit:Ptudw1831@web.znmrk.mongodb.net/data?retryWrites=true&w=majority';

// Create a new MongoClient
const client = new MongoClient(uri);
async function run() {
    try {
        // Connect the client to the server
        if(!client.isConnected()){
            await client.connect();
            console.log('Successfully connected');
        }


        // Establish and verify connection

        // const database = client.db('project_db');
        // const collection = database.collection('Products');
        // let cursor = await collection.find({});
        // return await cursor.toArray();
    }
    finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
exports.Connect = async ()=> {
    const a = await run().then();
    console.log(a);
}

exports.GetAll = async ()=> {
    await run().then();
    const database = await client.db('data');
    const collection = await database.collection('Products');
    let result =  await collection.find({});
    return await result.toArray().then();
}

exports.getFromDB = async (id) =>{
    await run().then();
    const database =  client.db('data');
    const collection = database.collection('Products');
    if(id.length > 11){
        let result =  await collection.find({'_id': ObjectId(id)});
        return result.toArray().then();
    }

}
