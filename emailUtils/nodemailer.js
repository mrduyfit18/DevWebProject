const nodemailer =  require('nodemailer');
const transporter =  nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD
    }
});

exports.sendActiveMail = async (account) => {
    const mainOptions = {
        from: process.env.ADMIN_EMAIL,
        to: account.email,
        subject: 'Kích hoạt tài khoản',
        html: '<p>Chào ' + account.name + '! Bạn vừa đăng ký tài khoản tại PC Trading. Nhấn vào đây' + '<a href="' +process.env.APP_DOMAIN_LOCAL + 'active/' + account._id + '"> Link</a> sau để kích hoạt tài khoản</p>'
    }
    transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' +  info.response);
        }
    });
}

exports.sendForgotPasswordMail = async (account, token) => {

    const mainOptions = {
        from: process.env.ADMIN_EMAIL,
        to: account.email,
        subject: 'Khôi phục mật khẩu',
        html: '<p>Chào ' + account.name + '! Để khôi phục lại mật khẩu, nhấn vào' + '<a href="' +process.env.APP_DOMAIN_LOCAL + 'recover/' + account.email + '?token='+ token +'"> đây</a></p>'
    }
    transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' +  info.response);
        }
    });
}