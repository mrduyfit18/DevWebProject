$('#signup-password').on('input',function(){
    $('#password-notification').html(' ');
});

$('#signup-email').on('input', function(){
    $('#email-notification').html(' ');
});

$('#confirm').on('input', function(){
    $('#password-notification').html(' ');
});

$('#signin-form').submit(function(event)
{
    event.preventDefault();
    $.ajax({
        type: 'POST',
        datatype:'text',
        url:'/signin',
        data:({
            email : $('#email').val(),
            password: $('#password').val()
        }),
        success: function(result)
        {
            if(parseInt(result) === 1)
            {
                window.location = window.location.href;
            }
            else
            {
                $('#signin-notification').html(result);
            }
        }
    });
});

$('#signup-form').submit(function(event)
{
    event.preventDefault();
    const password = $('#signup-password').val();
    const confirm = $('#confirm').val();
    if (confirm !== password){
        $('#password-notification').html('Mật khẩu không khớp');
        return;
    }
    $.ajax({
        method: 'POST',
        type: 'POST',
        datatype:'text',
        url:'/signup',
        data:({
            email : $('#signup-email').val(),
            password: password,
            name: $('#signup-name').val()
        }),
        success: function(result)
        {
            if(parseInt(result) === 1)
            {
                $('#Modal-Registration').modal('hide')
                $('#signup-notification-modal').modal('toggle');

            }
            else
            {
                $('#email-notification').html(result);
            }
        }
    });
});

//Google Auth
// $('#signin-google').on("click",function(){
//     event.preventDefault();
//     $.ajax({
//         method: 'POST',
//         type: 'POST',
//         datatype:'text',
//         url:'/signin/google',
//         success: function(result)
//         {
//             if(parseInt(result) === 1)
//             {
//                 window.location = window.location.href;
//             }
//             else
//             {
//                 $('#signin-notification').html(result);
//             }
//         }
//     });
// })