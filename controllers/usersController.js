const formidable = require('formidable');
const fs = require('fs');
const admin = require("firebase-admin");
const uuid = require('uuid-v4');
const mailSender = require('../emailUtils/nodemailer');

const usersModel = require('../models/usersModel');

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


exports.Signin = async (req, res, next) => {
    const check =  await usersModel.Signin(req);
    if(check === false){
        const notification = 'Email or password is incorrect!!';
        const status =  true;
        res.render('index', {status, notification});
    }
    else{
        const status = false;
        res.render('index', {status, userName: check.name, id: check._id});
    }
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
    console.log(req.params.id);
    const account = await usersModel.getAccount(await req.params.id);
    res.render('user', {account});

}

exports.saveProfileChange = async (req, res, next) => {
    const form = formidable({ multiples: true });
    let newPath;
    console.log(req.params.id);
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
        usersModel.SaveProfileChange(fields, newPath, req.params.id).then(res.redirect('/'));
    });
}

exports.activeAccount = async (req, res, next) => {
    await usersModel.activeAccount(req.params.id);
    res.render('activeSuccess');

}