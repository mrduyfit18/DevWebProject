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
                console.log(result);
                window.location = window.location.href;
            }
            else if(parseInt(result) === 2){
                window.location = 'http://webdevmanage.herokuapp.com/'
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
$('#signin-google').on("click",function(){
    const top = (screen.height - 700)/2 - 100;
    const left = (screen.width - 500)/2;
    const authenticateWindow = window.open("/signin/google", "", "width=500, height=700, top="+top+", left=" +left);
})

$(window).on("load",function(){
    if(window.opener){
        window.opener.location.reload();
        window.close();
    }
})

$('#emailAuth').on('change', function(){
    $('#forgot-password-notification').html('');
});

function forgotPassword_click(){
    const email = $('#emailAuth').val();
    if(email.length === 0) {
        $('#forgot-password-notification').html('Vui lòng điền đầy đủ thông tin');
        return;
    }
    if(!email.includes("@")){
        $('#forgot-password-notification').html('Email chưa đúng! Vui lòng nhập lại');
        return;
    }
    $.ajax({
        method: 'POST',
        type: 'POST',
        datatype:'text',
        url:'/forgot-password',
        data:({
            email: email,
        }),
        success: function(result)
        {
            if(result === 'true')
            {
                $('#forgot-password-notification').html('Email xác nhận đã được gửi').removeClass('err-signin').addClass('success-signin');
                setTimeout(function(){
                    $('#Modal-ForgotPassword').modal('hide');
                    $('#forgot-password-notification').html('');
                }, 2000);
            }
            else
            {
                $('#forgot-password-notification').html('Email không tồn tại');
            }
        }
    });
}

$('#recover-form').on('submit', function(){
    event.preventDefault();
    const password = $('#recover-form').find('input[name="password"]').val();
    const rePassword = $('#recover-form').find('input[name="rePassword"]').val();
    if(password!==rePassword){
        $('#recover-notification').html('Mật khẩu không khớp');
        return;
    }
    const url = window.location.origin + window.location.pathname + '/submit' + window.location.search;
    $.ajax({
        method: 'POST',
        type: 'POST',
        datatype:'text',
        url: url,
        data:({
            password: password,
        }),
        success: function(result)
        {
            if(result === 'true')
            {
                $('#recover-notification').html('Mật khẩu đã được khôi phục thành công').removeClass('err-signin').addClass('success-signin');
            }
            else
            {
                $('#recover-notification').html('Yêu cầu của bạn dã hết hạn hoặc không hợp lệ!! Bạn hãy thực hiện lại');
            }
            setTimeout(function(){
                window.location = window.location.origin;
            }, 2000);
        }
    });

});