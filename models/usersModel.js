const {database} = require('../DAL/loadDatabase');
const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const ObjectId = mongoose.Types.ObjectId;

const Accounts = require('./mongooseModels/accounts');

exports.Signin = async (username, password) =>{
    const account = await Accounts.findOne({email: username});
    /*if(account.password === req.body.password){
        return account;
    }
    else{
        return false;
    }*/
    if(!account){
        return false;
    }
    let checkPassword = await bcrypt.compare(password, account.password);
    if(checkPassword){
        console.log(checkPassword);
        return account;
    }
    else{
        console.log(checkPassword);
        return false;
    }
}

exports.Signup = async (req) =>{
    const account = await Accounts.findOne({'email': req.body.email});
    if(account === null){

        const saltRounds = 10;
        await bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                let account = ({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                    status: 'offline',
                    avatar :'https://firebasestorage.googleapis.com/v0/b/storageserver-b4fd7.appspot.com/o/null%20avatar.jpg?alt=media',
                    type: 'customer'
                });

                /*account.save().then((doc)=>{})
                    .then((err)=>{console.log(err);});*/
                Accounts.insertMany(account).then((doc)=>{})
                    .then((err)=>{console.log(err);});
            });
        });
        return true;
    }
    else{
        return false;
    }
}

exports.getAccount = (id) =>{
    return Accounts.findOne({'_id': ObjectId(id)});
}

exports.SaveProfileChange = async (fields, avatarLocal, id) => {
    const fileName = avatarLocal.split('/').pop();
    const avatarPath = process.env.GClOUD_IMAGE_FOlDER + fileName + '?alt=media'
    await Accounts.updateOne({_id: ObjectId(id)},{'name': fields.name, password: fields.password, avatar: avatarPath});
}
