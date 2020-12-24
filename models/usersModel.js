const {database} = require('../DAL/loadDatabase');
const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const ObjectId = mongoose.Types.ObjectId;

const Accounts = require('./mongooseModels/accounts');

exports.Signin = async (req) =>{
    const account = await Accounts.findOne({'email': req.body.email});
    if(account.password === req.body.password){
        return account;
    }
    else{
        return false;
    }
}

exports.Signup = async (req) =>{
    const account = await Accounts.findOne({'email': req.body.email});
    if(account === null){

        const saltRounds = 10;
        await bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                let newAccount = ({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    status: 'offline',
                    avatar :'https://firebasestorage.googleapis.com/v0/b/storageserver-b4fd7.appspot.com/o/null%20avatar.jpg?alt=media',
                    type: 'customer'
                })
                console.log(newAccount.password);
                console.log(newAccount.name);
                Accounts.insertMany(newAccount);
                /*newAccount.save().then((doc)=>{})
                    .then((err)=>{console.log(err);});*/
            });
        });
        return true;
    }
    else{
        return false;
    }
}

exports.getAccount = async (id) =>{
    return Accounts.findOne(ObjectId(id));
}

exports.SaveProfileChange = async (fields, avatarLocal, id) => {
    const fileName = avatarLocal.split('/').pop();
    const avatarPath = process.env.GClOUD_IMAGE_FOlDER + fileName + '?alt=media'
    await Accounts.updateOne({_id: ObjectId(id)},{'name': fields.name, password: fields.password, avatar: avatarPath});
}
