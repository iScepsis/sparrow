let express = require('express');
let router = express.Router();
let async = require('async');
let Message = require('../models/message').Message;
let Room = require('../models/room').Room;

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.isAuthenticated()) {
        async.series({
            messages: function (callback) {
                Message.find(null, function (err, messages) {
                    callback(err, messages);
                });
            },
            rooms: function(callback){
                Room.find(null, function (err, rooms) {
                    callback(err, rooms);
                });
            }
        }, function(err, results) {
            if (err) {
                console.log(err);
            } else {
                res.render('chat/index', {
                    title: 'Чат',
                    rooms: results.rooms,
                    messages: results.messages,
               });
            }
        });
    } else {
        res.redirect('/403');
    }
});

module.exports = router;
