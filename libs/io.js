let Message = require('../models/message').Message;
let Room = require('../models/room').Room;
var config = require('../config');

module.exports = function(server) {
    var io = require('socket.io')(server);

    io.on('connection', function(socket){

        if (socket.currentRoom === null || socket.currentRoom === undefined) {
            socket.currentRoom = config.get('chat:defaultRoom');
        }

        socket.join(config.get('chat:defaultRoom'));

        socket.on('set-username', function(username) {
            socket.username = username;
        });

        /**
         * Новое сообщение
         */
        socket.on('chat message', function(msg){
            let newMsg = new Message({
                namespace: '\\',
                room: this.currentRoom,
                user: socket.username,
                msg: msg
            });

            newMsg.save().then(function(msg) {
                console.log('msg saved');
            }).catch(function(err){
               // console.log('Error during save msg:');
               // console.log('error');
                next(new Error("Can't create message: " + err));
            });

            io.emit('chat message',
                '<div class="single-msg-wrap" data-author="' + socket.username + '">' +
                    '<b class="msg-username">' + socket.username + '</b>: <span class="msg-content">' + msg + '</span>' +
                '</div>'
            );
        });

        /**
         * Присоединяемся к комнате
         */
        socket.on('join room', function(roomName){
            async.waterfall([
                /*function(callback) {
                    socket.leave(this.currentRoom);
                    Room.findOne({name: this.currentRoom}, function (err, room) {
                        for (let i in room.participants) {
                            if (room.participants[i] == socket.username) room.participants.splice(i, 1);
                        }
                        room.save(function(err) {
                            callback(err, null);
                        });
                    });

                },*/
                function(callback) {
                    socket.join(roomName);
                    this.currentRoom = roomName;
                    Room.findOne({name: this.currentRoom}, function (err, room) {
                        room.participants.push(socket.username);
                        room.save(function(err) {
                            callback(err, null)
                        });
                    });
                }
            ], function (err, result) {
                if (err) {
                    socket.emit('join room error', err);
                } else {
                    socket.emit('room joined');
                }
            });
        });

        /**
         * Создание комнаты
         */
        socket.on('create room', function(roomData){
            Room.findOne({name: roomData.roomName}, function (err, room) {
                if (room) {
                    io.emit('room exist');
                } else {
                    let participants = roomData.participants || [];
                    participants.push(socket.username);
                    //TODO: реализовать добавление к комнатам для юзеров
                    let newRoom = new Room({
                        name: roomData.roomName,
                        author: socket.username,
                        participants: participants
                    });
                    newRoom.save().then(function(room){
                        io.emit('room created');
                    }).catch(function(error){
                        io.emit('room create error', error);
                    });
                }
            });
        });

        /**
         * Печать
         */
        socket.on('typing', function(){
            socket.broadcast.emit('typing', {
                username: socket.username
            });
        });

        /**
         * Проверяем наличие комнаты
         * @param room
         * @returns {boolean}
         */
        socket.checkExistRoom = function(room){
            return this.rooms.indexOf(room) >= 0;
        }

    });



    return io;

};