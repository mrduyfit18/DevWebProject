function readURL(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            $('#avatar').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
}

$("#imgInp").change(function() {
    readURL(this);
});

$(window).on('load', function() {
    $('#active-success-notification-modal').modal('show');
});

$("#active-success-notification-modal").on('hide.bs.modal', function () {
    window.location= window.location.origin;
});
