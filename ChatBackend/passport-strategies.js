//This file configures the strategies for passport

//Load the strategy modules
const passportLocal = require('passport-local');
const passportJwt = require('passport-jwt');

//Load the config
const config = require('./config');

//Add the user model (for checking user existence)
const User = require('./models/user');


//Configure the 'local' strategy for user login
const localStrategy = new passportLocal.Strategy({
    usernameField: 'username',
    passwordField: 'password'
}, (username, password, done) => {
    let user = User.findOne({ username: username }, (error, user) => {
        if (error)
            done(error);
        else if (user)
            done(null, user);
        else 
            done(null, null);
    });
});

//Configure the JWT strategy for session authentication
const jwtStrategy = new passportJwt.Strategy({
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: config.jwtKey
}, (payload, done) => {
    let user = User.findOne({ username: payload.username }, (error, user) => {
        if (error)
            done(error);
        else if (user)
            done(null, user);
        else 
            done(null, null);
    });
});


//Export the strategies
exports.local = localStrategy;
exports.jwt = jwtStrategy;