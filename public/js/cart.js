//Remove
$('.cart').on('click', 'a[href="#remove"]', function(){
    const productID =  $(this).parents('.controls').find('.input-group').data('id');
    const path = '/api/cart/' + productID +'/remove';
    const number = parseInt($(this).parents('.controls').find('.input-group').find('input').val());

    $.getJSON(path, (data) =>{
        if(data==='OK') {
            $(this).parents('.media').fadeOut('300');
            $('.cart-num').text(parseInt($('.cart-num')[0].textContent) - number )
        }
        else{
            alert(data);
            window.location = window.location.origin+'/store';
        }
    });

});
//Remove

//Count
$('.cart').on('click', '.input-group button[data-action="plus"]', async function(){
    const productID =  $(this).parents('.input-group').data('id');
    const currentNum = $(this).parents('.input-group').find('input').val();
    const path = '/api/cart/' + productID +'/increase?oldNum='+ currentNum;

    $.getJSON(path, (data) =>{
        if(data==='OK') {
            $(this).parents('.input-group').find('input').val( parseInt($(this).parents('.input-group').find('input').val()) + 1 );
            $('.cart-num').text(parseInt($('.cart-num')[0].textContent) + 1 )
        }
        else{
            alert(data);
            window.location = window.location.origin+'/store';
        }
    });
});
$('.cart').on('click', '.input-group button[data-action="minus"]', function(){
    const productID =  $(this).parents('.input-group').data('id');
    const currentNum = $(this).parents('.input-group').find('input').val();
    const path = '/api/cart/' + productID +'/decrease?oldNum='+ currentNum;

    if( parseInt(currentNum) > 1 ) {
        $.getJSON(path, (data) =>{
            if(data==='OK') {
                $(this).parents('.input-group').find('input').val( parseInt($(this).parents('.input-group').find('input').val()) - 1 );
                $('.cart-num').text(parseInt($('.cart-num')[0].textContent) - 1 )
            }
            else{
                alert(data);
                window.location = window.location.origin+'/store';
            }
        });
    }
});
//Count

function addToCart_Click (thisButton) {
    const productID = thisButton.id;
    $.getJSON('/api/add-to-cart?productID='+ productID, (data) =>{
        renderCart(data);
    })
}


function renderCart(data)
{
    let template = Handlebars.compile($('#cart-product-template').html());
    const cartProductHtml = template({cart: data});
    $('#cart-content').html(cartProductHtml);
    template = Handlebars.compile($('#cart-label-template').html());
    const cartLabelHtml = template({cart: data});
    $('#cart-label').html(cartLabelHtml);
    template = Handlebars.compile($('#nav-cart-label-template').html());
    const navCartLabelHtml = template({cart: data});
    $('#nav-cart-label').html(navCartLabelHtml);
}