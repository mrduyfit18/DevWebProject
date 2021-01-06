const {database} = require('../DAL/loadDatabase');
const mongoose=require('mongoose');
const bcrypt = require('bcrypt');

const tokens = require('./mongooseModels/token');

exports.genToken = async (plainText) => {
    plainText = plainText.toString();
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plainText, salt);
    const date = new Date();
    return tokens.create({token: hash, date: date});
}

exports.checkToken = async (token, userID) => {
    userID = userID.toString();
    const checkToken = await tokens.findOneAndDelete({'token': token});
    if(checkToken){
        const check = await bcrypt.compare(userID, token);
        if(check === true){
            return true;
        }
    }
    return false;
}