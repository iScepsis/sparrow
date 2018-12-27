$(function () {
    var socket = io();
    socket.emit('set-username', user.username);

    $('form').submit(function(){
        let inputArea = $(this).find('.chat-textarea');
        socket.emit('chat message', $(inputArea).val());
        $(inputArea).val('');
        return false;
    });
    socket.on('chat message', function(msg){
        $('.msg-list').append(msg);
    });
});