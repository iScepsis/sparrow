$(document).ready(function(){



    $('#registryForm').validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            username: {
                required: true,
                minlength: 3,
                maxlength: 16
            },
            password: {
                required: true,
                minlength: 6,
                maxlength: 16
            },
            repeatPassword: {
                required: true,
                equalTo: "#password"
            }

        },
        messages: {
            email: {
                required: "Email обязателен для заполнения",
                email: "Введите валидный email-адрес"
            },
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
            repeatPassword: {
                required: "Необходимо повторить пароль",
                equalTo: "Пароли не совпадают"
            }
        }
    });

    $('#registryForm').on('submit', function(e){
        e.preventDefault();

        if ($(this).validate()) {
            $.ajax({
                url: 'registry',
                method: 'post',
                dataType: 'json',
                data: {
                    email: $('#email').val(),
                    username: $('#username').val(),
                    password: $('#password').val(),
                    passwordRepeat: $('#passwordRepeat').val()
                },
                success: function (res) {
                    if (res.result == true) {
                        $('#registryForm').slideUp(300);
                        $('#success_msg').slideDown(300);
                    } else {
                        $('#failure_msg').slideDown(300);
                    }
                }
            });
        }

    });

});