const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const userService = require('../models/usersModel');



passport.use(new LocalStrategy({usernameField: 'email',},
    async function(email, password, done) {
        const user = await userService.Signin(email, password);
        if (!user) {
            return done(null, false, { message: 'Email không tồn tại!!' });
        }
        else if(user === -1){
            return done(null, false, { message: 'Mật khẩu không chính xác!!' });
        }
        else if(user.status === 'inactive'){
            return done(null, false, { message: 'Tài khoản của bạn chưa được kích hoạt, Vui lòng kiểm tra Email' });
        } else if(user.status === 'blocked'){
            return done(null, false, { message: 'Tài khoản của bạn đã bị khoá' });
        }
        return done(null, user);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    userService.getAccount(id).then((user)=>{
        done(null, user)
    })
})



// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.APP_DOMAIN + 'signin/google/callback'    //APP_DOMAIN_LOCAL if run local
    },
    async function(accessToken, refreshToken, profile, done) {
        const user = await userService.findOrCreate( profile);
        return done(null, user);
    }
));


passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL:  process.env.APP_DOMAIN+'signin/facebook/callback'
    },
    async function(accessToken, refreshToken, profile, done) {
        const user = await userService.findOrCreate( profile);
        return done(null, user);
    }
));

module.exports = passport;
