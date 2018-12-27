let Message = require('../models/message').Message;

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
            let newMsg = new Message({
                namespace: '\\',
                room: 'main',
                user: socket.username,
                msg: msg
            });

            newMsg.save().then(function(msg) {
                console.log('msg saved');
            }).catch(function(error){
                console.log('Error during save msg:');
                console.log('error');
            });

            io.emit('chat message',
                '<div class="single-msg-wrap" data-author="' + socket.username + '">' +
                    '<b class="msg-username">' + socket.username + '</b>: <span class="msg-content">' + msg + '</span>' +
                '</div>'
            );
        });


    });



    return io;

};