$(document).ready(function(){

    $('#authForm').on('submit', function(e){
        e.preventDefault();

        $.ajax({
                url: 'auth',
                method: 'post',
                dataType: 'json',
                data: {
                    username: $('#username').val(),
                    password: $('#password').val(),
                },
                success: function (res) {
                    if (res.result == true) {
                        location.href = '/';
                    } else {
                        $('#failure_msg').slideDown(300);
                    }
                }
            });

    });

});