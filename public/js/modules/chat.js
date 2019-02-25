var typingUsers = [];
var typingLength = 0;

$(function () {
    var socket = io();
    var info_area = $('.info-area');


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

    socket.on('typing', function(username) {
        console.log(username + ' печатает');

    });

    $('.chat-textarea').on('keyup', function(){
        socket.emit('typing');
    });

});

function addTypingUsers(username){

}

