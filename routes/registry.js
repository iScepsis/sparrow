var express = require('express');
var router = express.Router();
var mongoose = require('../libs/mongoose');
var User = require('../models/user').User;

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('registry/index', {
        title: 'Registration',
    });
});

router.post('/', function (req, res) {

    res.setHeader('Content-Type', 'application/json');
    //res.send(JSON.stringify({ a: 1 }));

    var newUser = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    var result = {result: true};

    //Проверяем на наличие пользователя с таким email
    User.find({email: newUser.email},
        function (err, docs) {
            if (!err) {
                if (docs) result = { result: false, reason: 'email is duplicate'};
            } else {
                result = { result: false, reason: 'error'};
            }
        });

    if (result === false) res.send(JSON.stringify(result));

    //Проверяем на наличие пользователя с таким логином
    User.find({username: newUser.username},
        function (err, docs) {
            if (!err) {
                if (docs) result = { result: false, reason: 'username is duplicate'};
            } else {
                result = { result: false, reason: 'error'};
            }
        });


    newUser.save(function (err) {
        if (err) {
            res.send(JSON.stringify({ result: false, reason: 'create error'}));
        } else {
            res.send(JSON.stringify({ result: true }));
        }
    });

    /*res.send('welcome, ' + req.body.username);
    console.log(req.body.username);*/
});

module.exports = router;