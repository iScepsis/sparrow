$(document).ready(function(){



    $('#registryForm').validate({
        rules: {
            username: {
                required: true,
                minlength: 8,
                maxlength: 16
            },
            password: {
                required: true,
                minlength: 6,
                maxlength: 16
            },

        },
        messages: {
            username: {
                required: "Логин пользователя необходим для идентификации в системе",
                minlength: $.validator.format("Логин должен содержать как минимум {0} символов!"),
                maxlength: $.validator.format("Логин должен содержать не более {0} символов!"),
            },
            password: {
                required: "Пароль обязателен для заполнения",
                minlength: $.validator.format("Пароль должен содержать как минимум {0} символов!"),
                maxlength: $.validator.format("Пароль должен содержать не более {0} символов!"),
            },
        }
    });

    $('#registryForm').on('submit', function(e){
        e.preventDefault();

        $.ajax({
            url: 'registry',
            method: 'post',
            dataType: json,
            data: {
                email: $('#email').val(),
                username: $('#username').val(),
                password: $('#password').val(),
                passwordRepeat: $('#passwordRepeat').val()
            },
            success: function (res) {
                console.log(res);
            }
        });

    });

});