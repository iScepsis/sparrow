var express = require('express');
var async = require('async');
var util = require('util');
var router = express.Router();
var mongoose = require('../libs/mongoose');
var User = require('../models/user').User;

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('registry/index', {
        title: 'Registration',
    });
});

router.post('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');

    async.series({
        //check email
        checkEmail: function (callback) {
            User.find({email: req.body.email}, function(e, d) {
                callback(null, !d.length);
            });
        },
        checkUsername: function (callback) {
            User.find({username: req.body.username}, function(e, d) {
                callback(null, !d.length);
            });
        }
    }, function(err, results) {
           // if (err) console.log(err);
        if (!results.checkEmail) return res.json({
            result: false, reason: 'Пользователь с таким email уже существует'
        });
        if (!results.checkUsername) return res.json({
            result: false, reason: 'Пользователь с таким логином уже существует'
        });

        var newUser = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });

        newUser.save().then(function(){
            return res.json({ result: true });
        }).catch(next);

    });
});

module.exports = router;