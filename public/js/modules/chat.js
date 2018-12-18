$(function () {
    var socket = io();
    socket.emit('set-username', user.username);

    $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(msg){
        $('#chat').append(msg);
    });
});