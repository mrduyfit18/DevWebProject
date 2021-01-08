$('#change-password-button').on('click', function(){
    $('#Modal-Change-Password').modal('show');
})

function ChangePasswordSaveButton_Click() {
    event.preventDefault();
    const oldPassword = $('#oldPassword').val();
    const newPassword = $('#newPassword').val();
    const reNewPassword = $('#reNewPassword').val();
    if(oldPassword.length === 0 || newPassword.length === 0 || reNewPassword.length === 0) {
        $('#validate-notification').html('Vui lòng điền đầy đủ thông tin');
        return;
    }
    if(newPassword !== reNewPassword){
        $('#new-password-notification').html('Mật khẩu không trùng khớp');
        return;
    }
    $.ajax({
        method: 'POST',
        type: 'POST',
        datatype:'text',
        url:'/users/change-password',
        data:({
            oldPassword: oldPassword,
            newPassword: newPassword,
        }),
        success: function(result)
        {
            if(result === 'true')
            {
                $('#validate-notification').html('Mật khẩu đã được cập nhật').removeClass('err-signin').addClass('success-signin');
                setTimeout(function(){
                    $('#Modal-Change-Password').modal('hide');
                    document.getElementById('change-password-form').reset();
                    $('#validate-notification').html('');
                }, 2000);
            }
            else
            {
                $('#old-password-notification').html('Mật khẩu cũ không chính xác');
            }
        }
    });
}

$('#oldPassword').on('change', function(){
    $('#old-password-notification').html('');
    $('#validate-notification').html('');
});

$('#newPassword').on('change', function(){
    $('#new-password-notification').html('');
    $('#validate-notification').html('');
});

$('#reNewPassword').on('change', function(){
    $('#new-password-notification').html('');
    $('#validate-notification').html('');
});

function userMenu_click(button){
    $(button).parent().find('button').removeClass('active');
    $(button).addClass('active');
    const option = ($(button).data('id'));
    switch (option){
        case 3:
            $.ajax({
                method: 'GET',
                type: 'GET',
                url:'/users/orders?ajax=true',
                success: function(result)
                {
                    $('#user-content').html(result);
                    window.history.pushState("object or string", "Title", '/users/orders');
                }
            });
            break;
        case 1:
            $.ajax({
                method: 'GET',
                type: 'GET',
                url:'/users/edit?ajax=true',
                success: function(result)
                {
                    $('#user-content').html(result);
                    window.history.pushState("object or string", "Title", '/users/edit');
                }
            });
            break;
        case 2:
            $.ajax({
                method: 'GET',
                type: 'GET',
                url:'/users/reserves?ajax=true',
                success: function(result)
                {
                    $('#user-content').html(result);
                    window.history.pushState("object or string", "Title", '/users/reserves');
                }
            });

    }
}

