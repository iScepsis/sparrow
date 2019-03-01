var typingUsers = [];
var typingLength = 0;
var roomCreateValidator = {
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
};

$(function () {

    var socket = io();

    socket.emit('set-username', user.username);

    /**
     * Присоединяемся к комнатам, в которых участвует пользователь
     */
    for (var i in user.participateInRooms) {
        socket.emit('join room', user.participateInRooms[i]);
    }

    var info_area = $('.info-area');

    /**
     * Клик по пункту из списка комнат. Загружаем сообщения для данной комнаты
     */
    $('.room-pill').on('click', function(){
        $('.msg-list').html('');
        $.ajax({
            url: 'chat/load-messages',
            method: 'post',
            dataType: 'json',
            data: {
                room: $(this).data('room')
            },
            success: function (res) {
                if (res.result !== undefined && res.result) {
                    var html = '';
                    for (var i in res.messages) {
                        html += '<div class="single-msg-wrap" data-author="' + res.messages[i]['user'] + '">' +
                            '<b class="msg-username">' + res.messages[i]['user'] + '</b>: <span class="msg-content">' + res.messages[i]['msg'] + '</span>' +
                            '</div>'
                    }
                    $('.msg-list').prepend(html);
                }
            }
        });
    });

    /**
     * Кликаем по первой комнате, дабы загрузить содержимое чата для нее
     */
    $('.room-pill').eq(0).click();

    /**
     * Валидатор для формы создания комнаты
     */
    $('#roomCreateForm').validate(roomCreateValidator);

    $('#createRoom').on('hidden.bs.modal', function () {
        $(this).find('.createRoomBtn').prop('disabled', false);
        $('#roomCreateInfo').hide();
    });



    $('#input-area').submit(function(){
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

    socket.on('join room error', function(error){
        showModal('Ошибка при присоединении к комнате: ' + error, 'Ошибка', 'danger');
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
