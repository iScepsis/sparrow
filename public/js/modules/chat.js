var typingUsers = [];
var typingLength = 0;

$(function () {

    var socket = io();
    var info_area = $('.info-area');

    $('#roomCreateForm').validate({
        rules: {
            roomName: {
                required: true,
                minlength: 3,
                maxlength: 100
            },

        },
        messages: {
            roomName: {
                required: "введите название комнаты",
                minlength: $.validator.format("Название комнаты должно содержать минимум {0} символов!"),
                maxlength: $.validator.format("Название комнаты должно содержать максимум {0} символов!"),
            }
        }
    });

    $('#createRoom').on('hidden.bs.modal', function () {
        $(this).find('.createRoomBtn').prop('disabled', false);
        $('#roomCreateInfo').hide();
    });

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

    socket.on('room exist', function() {
        $('#roomCreateInfo')
            .html(getAlert('Комната с указанным именем уже существует. Выберите другое имя', 'warning'))
            .show();
    });

    socket.on('room created', function() {
        $('#roomCreateInfo')
            .html(getAlert('Комната успешно создана', 'success'))
            .show();
        setTimeout(function(){
            $('#createRoom').modal('hide');
        }, 1500);
    });

    socket.on('room create error', function(error){
        $('#roomCreateInfo')
            .html(getAlert('Ошибка при создании комнаты', 'danger'))
            .show();
    });

    $('.createRoomBtn').on('click', function(){
        var form = $('#roomCreateForm');

        if (form.valid()) {
            socket.emit('create room', {
                roomName: form.find('[name="roomName"]').val()
            });
        }
    });


});

function addTypingUsers(username){

}

function getAlert(content, type) {
    type = type || 'alert-info';
    return '<div class="alert alert-' + type +'">' + content + '</div>'
}
