module.exports = function(server) {
    var io = require('socket.io')(server);

    io.on('connection', function(socket){
        socket.on('set-username', function(username) {
            socket.username = username;
            console.log(socket.username);
        });

        socket.on('chat message', function(msg){
            io.emit('chat message',
                '<div class="msg-wrap" data-author="' + socket.username + '">' +
                    '<b class="msg-username">' + socket.username + '</b>: <span class="msg-content">' + msg + '</span>' +
                '</div>'
            );
        });


    });



    return io;

};