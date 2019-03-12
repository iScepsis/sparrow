var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , User = require('../models/user').User;

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user || !user.checkPassword(password)) {
                return done(null, false, { message: 'Неверный логин и/или пароль!' });
            }
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

module.exports = passport;