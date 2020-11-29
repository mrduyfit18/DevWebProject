const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
// Connection URI
const uri ='mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
// Create a new MongoClient
const client = new MongoClient(uri);
async function run() {
    try {
        // Connect the client to the server
        if(!client.isConnected()){
            await client.connect();
            console.log("Connected successfully to server");
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
    run().then();
}

exports.GetAll = async ()=> {
    await run();
    const database =  client.db('project_db');
    const collection = database.collection('Products');
    let result =  await collection.find({});

    return result.toArray().then();
}

exports.getFromDB = async (id) =>{
    await run().then();
    const database =  client.db('project_db');
    const collection = database.collection('Products');
    if(id.length > 11){
        let result =  await collection.find({'_id': ObjectId(id)});
        return result.toArray().then();
    }

}
