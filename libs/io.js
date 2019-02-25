let Message = require('../models/message').Message;
let Room = require('../models/room').Room;
var config = require('../config');

module.exports = function(server) {
    var io = require('socket.io')(server);

    io.on('connection', function(socket){

        socket.currentRoom = config.get('chat:defaultRoom');
        socket.join(config.get('chat:defaultRoom'));

        socket.on('set-username', function(username) {
            socket.username = username;
            console.log(socket.username);
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
            }).catch(function(error){
               // console.log('Error during save msg:');
               // console.log('error');
                next(new Error("Can't create message: " + error));
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
            socket.join(roomName);
        });

        /**
         * Создание комнаты
         */
        socket.on('create room', function(roomName){
            Room.findOne({name: roomName}, function (err, room) {
                if (room) {
                    io.emit('room exist');
                } else {
                    let newRoom = new Room({
                        name: roomName
                    });
                    newRoom.save().then(function(room){
                        io.emit('room created');
                    }).catch(function(error){
                        io.emit('room create error');
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