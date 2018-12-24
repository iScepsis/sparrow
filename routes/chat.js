let express = require('express');
let router = express.Router();
let async = require('async');
let Chat = require('../models/chat').Chat;

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.isAuthenticated()) {
        async.waterfall([
                function(callback) {
                    Chat.find(null, function(err, messages){
                        callback(err, messages);
                    });
                }
            ],
            function (err, messages){
                if (err) {
                    console.log(err);
                } else {
                    res.render('chat/index', {
                        title: 'Чат',
                        messages: messages
                    });
                }
            }
        );


    } else {
        res.redirect('/403');
    }
});

module.exports = router;
