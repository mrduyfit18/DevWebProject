const formidable = require('formidable');
const fs = require('fs');
const admin = require("firebase-admin");
const uuid = require('uuid-v4');
const mailSender = require('../emailUtils/nodemailer');
const bcrypt = require('bcrypt');

const usersModel = require('../models/usersModel');
const tokenModel = require('../models/tokenModel');

const adminAccount = require('../storageserver-b4fd7-firebase-adminsdk-o7qpl-3939aaef50.json');

admin.initializeApp({
    credential: admin.credential.cert(adminAccount),
    storageBucket: 'gs://storageserver-b4fd7.appspot.com/'
});

const bucket = admin.storage().bucket();

async function uploadFile(filePath, fileInfo) {

    const metadata = {
        metadata: {
            // This line is very important. It's to create a download token.
            firebaseStorageDownloadTokens: uuid()
        },
        contentType: fileInfo.type,
        cacheControl: 'public, max-age=31536000',
    };

    // Uploads a local file to the bucket
    const fileName = filePath.split('/').pop();
    await bucket.upload(filePath,{
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        destination: 'avatars/' + fileName,
        gzip: true,
        metadata: metadata,
    });
}



exports.Signup = async (req, res, next) => {
    const check = await usersModel.Signup(req);
    if(check){
        const newAccount  = await usersModel.getAccountByEmail(req.body.email);
        await mailSender.sendActiveMail(newAccount);
        res.send('1');
    }
    else{
        res.send('Email đã tồn tại!!!');
    }
}

exports.edit = async (req, res, next) => {
    const userID = req.user._id;
    const account = await usersModel.getAccount(userID);
    res.render('user', {account});

}

exports.saveProfileChange = async (req, res, next) => {
    const form = formidable({ multiples: true });
    let newPath;
    const userID= req.user._id;
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        if(files.avatar.name && files.avatar.type.includes('image') && files.avatar.size>0) {
            const res = files.avatar.name.split('.').pop();
            newPath  = files.avatar.path + '.' + res;
            fs.rename(files.avatar.path, newPath,() => {
                uploadFile(newPath, files.avatar).then();
            });
        }
        usersModel.SaveProfileChange(fields, newPath, userID).then(res.redirect('/'));
    });
}

exports.activeAccount = async (req, res, next) => {
    const userID = req.params.id;
    await usersModel.activeAccount(userID);
    const notification = 'Tài khoản của bạn đã được kích hoạt thành công';
    res.render('notification', {notification});
}

exports.changePassword = async (req, res, next) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const userID = req.user._id;
    const check = await usersModel.updatePassword(userID, oldPassword, newPassword);
    res.send(check.toString());
}

exports.forgotPassword = async (req, res, next) => {
    const email = req.body.email;
    const check = await usersModel.getAccountByEmail(email);
    if(check){
        const token = await tokenModel.genToken(check._id);
        await mailSender.sendForgotPasswordMail(check, token.token);
        res.send('true');
    }
    else{
        res.send('false');
    }
}

exports.recoverPassword = async (req, res, next) => {
    const password = req.body.password;
    const email = req.params.email;
    const token = req.query.token;
    const account = await usersModel.getAccountByEmail(email);
    if(account) {
        const check = await tokenModel.checkToken(token, account._id);
        if(check) {
            await usersModel.recoverPassword(account._id, password);
            res.send('true');
        }
        else{
            res.send('false');
        }

    }
    else {
        res.send('false');
    }

}