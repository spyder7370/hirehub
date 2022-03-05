const LocalStrategy = require('passport-local').Strategy,
      passport      = require('passport'),
      validPassword = require('./passportUtils').validPassword;

var User = require("../models/user");

const customFields = {
    usernameField: 'email',
    passwordField: 'password'
}


const verifyCallback = (username, password, done) => {
    User.findOne({ username: username },'username salt hash')
        .then((user) => {
            if (!user) return done(null, false);
            const isValid = validPassword(password, user.hash, user.salt);

            if (isValid) return done(null, user);
            else return done(null, false);
        })
        .catch((err) => {
            return done(err);
        });
}


const strategy = new LocalStrategy(customFields, verifyCallback);
passport.use(strategy);
passport.serializeUser((user, done) => {
    done(null, user._id);
})
passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch((err) => {
            done(err);
        })
})