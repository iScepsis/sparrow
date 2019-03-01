let express = require('express');
let router = express.Router();
let async = require('async');
let Message = require('../models/message').Message;
let Room = require('../models/room').Room;

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.isAuthenticated()) {
        async.series({
            /*messages: function (callback) {
                Message.find(null, function (err, messages) {
                    callback(err, messages);
                });
            },*/
            rooms: function(callback){
                Room.find()
                    .where('name').in(req.user.participateInRooms)
                    .where('is_active').equals(true)
                    .exec(function (err, rooms) {
                        callback(err, rooms);
                    });
            }
        }, function(err, results) {
            if (err) {
                next(new Error('При запуске'));
            } else {
                res.render('chat/index', {
                    title: 'Чат',
                    rooms: results.rooms,
                    //  messages: results.messages
               });
            }
        });
    } else {
        res.redirect('/403');
    }
});

/**
 * Получаем сообщения
 */
router.post('/load-messages', function(req, res, next) {
    if (req.isAuthenticated()) {
       Message.find()
           .where('room', req.body.room)
           .sort({date: 'asc'})
           .limit(50)
           .exec(function (err, messages) {
               if (err) {
                   return res.json({result: false, reason: err});
               } else {
                   return res.json({result: true, messages: messages});
               }
           });
    } else {
        res.status(403).send('You must be authenticated!');
    }
});

module.exports = router;