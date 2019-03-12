var express = require('express');
var async = require('async');
var router = express.Router();
var mongoose = require('../libs/mongoose');
var User = require('../models/user').User;

/* GET users listing. */
router.get('/', function (req, res, next) {
    async.waterfall([
            function(callback) {
                User.find(null, function(err, users){
                    callback(err, users);
                });
            }
        ],
        function (err, users){
            if (err) {
                console.log(err);
            } else {
                res.render('users-list/index', {
                    title: 'Список пользователей',
                    users: users
                });
            }
        }
    );
});

module.exports = router;