let Message = require('../models/message').Message;
let Room = require('../models/room').Room;
let User = require('../models/user').User;
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
                room: socket.currentRoom,
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

        socket.on('set current room',  function(roomName){
            socket.currentRoom = roomName;
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
                    Room.findOne({name: socket.currentRoom}, function (err, room) {
                        room.participants.push(socket.username);
                        room.save(function(err) {
                            callback(err, null)
                        });
                    });
                },
                function(callback) {
                    let users = [];
                    users.push(s);
                    addRoomToUsers(roomName, socket.username);
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
                    //Добавляем участникам метку об участии в новой комнате
                    let participants = roomData.participants || [];
                    participants.push(socket.username);
                    addRoomToUsers(roomData.roomName, participants);
                    //Создаем саму комнату
                    let newRoom = new Room({
                        name: roomData.roomName,
                        author: socket.username,
                        participants: participants
                    });
                    newRoom.save().then(function(room){
                        io.emit('room created', room);
                    }).catch(function(error){
                        io.emit('room create error', error);
                    });
                    //TODO: посылать присоединенным участникам бродкаст об участии в новой комнате
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


function addRoomToUsers(room,users) {
    for (let i in users) {
        User.findOne({username: users[i]}, function (err, user) {
            if (typeof user.participateInRooms !== 'object') user.participateInRooms = [];
            user.participateInRooms.push(room);
            user.save(function(err) {
                if (err) throw err;
            });
        })
    }
}