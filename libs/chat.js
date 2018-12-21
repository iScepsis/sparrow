let chatModel = require('../models/chat').Chat;

module.exports = function(server) {
    var io = require('socket.io')(server);

    io.on('connection', function(socket){
        socket.on('set-username', function(username) {
            socket.username = username;
            console.log(socket.username);
        });

        /**
         * Новое сообщение
         */
        socket.on('chat message', function(msg){
            let newMsg = new chatModel({
                namespace: '\\',
                room: 'main',
                user: socket.username,
                msg: msg
            });

            newMsg.save();

            io.emit('chat message',
                '<div class="single-msg-wrap" data-author="' + socket.username + '">' +
                    '<b class="msg-username">' + socket.username + '</b>: <span class="msg-content">' + msg + '</span>' +
                '</div>'
            );
        });


    });



    return io;

};