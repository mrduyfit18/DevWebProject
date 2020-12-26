const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

const userService = require('../models/usersModel');

passport.use(new LocalStrategy(
    async function(username, password, done) {
        const user = await userService.Signin(username, password);
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        return done(null, user);
    }
));

module.exports = passport;