var express = require('express');
var router = express.Router();
var passport = require('../libs/passport');

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('auth/index', {
            title: 'Авторизация',
            error: req.flash('error')
        });
    }
});



/*router.post('/', passport.authenticate('local', {
    successRedirect: 'auth/success',
    failureRedirect: 'auth/',
    failureFlash: true
}));*/

router.post('/', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        res.setHeader('Content-Type', 'application/json');

        if (err || !user) return res.json({ result: false });
        req.logIn(user, function(err) {
            if (err) { return res.json({ result: false }); }
            return res.json({ result: true });
        });
    })(req, res, next);
});


router.get('/success', function(req, res, next) {

    res.render('auth/success', {
        title: 'Авторизация прошла успешно',
    });
});


router.get('/failure', function(req, res, next) {

    res.render('auth/failure', {
        title: 'Авторизация провалилась',
    });
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;