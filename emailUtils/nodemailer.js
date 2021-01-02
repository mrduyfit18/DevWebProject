const nodemailer =  require('nodemailer');

exports.sendActiveMail = async (account) => {
    const transporter =  nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_EMAIL_PASSWORD
        }
    });
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