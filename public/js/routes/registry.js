$(document).ready(function(){

    $('#registryForm').on('submit', function(e){
        e.preventDefault();

        $.ajax({
            url: 'registry',
            method: 'post',
            data: {
                email: $('#userMail').val(),
                username: $('#userLogin').val(),
                password: $('#userPass').val(),
                passwordRep: $('#userPassRepeat').val()
            },
            success: function (res) {
                console.log(res);
            }
        });

    });

});