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