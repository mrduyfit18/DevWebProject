const {database} = require('../DAL/loadDatabase');
const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const ObjectId = mongoose.Types.ObjectId;

const Accounts = require('./mongooseModels/accounts');
const Contacts = require('./mongooseModels/contacts');

exports.Signin = async (email, password) =>{
    const account = await Accounts.findOne({email: email});
    /*if(account.password === req.body.password){
        return account;
    }
    else{
        return false;
    }*/
    if(!account){
        return 0;
    }
    let checkPassword = await bcrypt.compare(password, account.password);
    if(checkPassword){
        return account;
    }
    else{
        return -1;
    }
}

exports.Signup = async (req) =>{
    const account = await Accounts.findOne({'email': req.body.email});
    if(account === null){

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(req.body.password, salt)
        let account = await ({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            status: 'inactive',
            avatar :'https://firebasestorage.googleapis.com/v0/b/storageserver-b4fd7.appspot.com/o/null%20avatar.jpg?alt=media',
            type: 'customer'
        });

        await Accounts.insertMany(account)
        return true;
    }
    else{
        return false;
    }
}

exports.getAccount = (id) =>{
    return Accounts.findOne({'_id': ObjectId(id)}).populate('contacts');
}

exports.getAccountByEmail = async (email) =>{
    return Accounts.findOne({'email': email});
}

exports.SaveProfileChange = async (fields, avatarLocal, id) => {
    const fileName = avatarLocal.split('/').pop();
    const avatarPath = process.env.GClOUD_IMAGE_FOlDER + fileName + '?alt=media'
    await Accounts.updateOne({_id: ObjectId(id)},{'name': fields.name, password: fields.password, avatar: avatarPath});
}

exports.findOrCreate = async (profile) => {
    return Accounts.findOneAndUpdate({'email':profile._json.email}, {'$set': {'email': profile._json.email, 'name': profile.displayName,
        'type': 'customer', 'avatar': profile._json.picture, 'status': 'active'},
        }, {new: true, "upsert": true});
}


exports.activeAccount = async (id) =>{
    await Accounts.updateOne({'_id': id}, {'$set': {status: 'active'}});
}

exports.updatePassword = async (userID, oldPassword, newPassword) => {
    console.log(oldPassword, newPassword);
    const account = await Accounts.findById(ObjectId(userID));
    const check = await bcrypt.compare(oldPassword, account.password);
    if(check){
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashPassword = await bcrypt.hash(newPassword, salt);
        await Accounts.findByIdAndUpdate(ObjectId(userID), {'$set': {'password': hashPassword}});
        return true;
    }
    else{
        return false;
    }

}