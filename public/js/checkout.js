$(document).ready(function(){
	//Cart
		//Remove
			$('.checkout-cart').on('click', 'a[href="#remove"]', function(){
				$(this).parents('.media').fadeOut('300');
			});
		//Remove

		//Count
			$('.checkout-cart').on('click', '.input-group button[data-action="plus"]', function(){
				$(this).parents('.input-group').find('input').val( parseInt($(this).parents('.input-group').find('input').val()) + 1 );
			});
			$('.checkout-cart').on('click', '.input-group button[data-action="minus"]', function(){
				if( parseInt($(this).parents('.input-group').find('input').val()) > 1 ) {
					$(this).parents('.input-group').find('input').val( parseInt($(this).parents('.input-group').find('input').val()) - 1 );
				}
			});
		//Count
	//Cart
});

$('#checkout-button').on("click",function(){
	const numberProduct = document.getElementById('cart-num').textContent;
	if(parseInt(numberProduct)===0){
		if (confirm("Giỏ hàng hiện tại đang rỗng\nBạn có muốn chuyển đến cửa hàng?")) {
			window.location = window.location.origin + '/store';
		}
	}
	else{
		window.location = window.location.origin + '/checkout';
	}
})

$('#ChangeAddress-Button').on("click", function(){
	$('#Modal-Contact').modal('show');
})

$('input[type=radio][name=contact]').change(function() {
	const selectedContact = $("input[type='radio'][name=contact]:checked").val();
	$.ajax({
		method: 'POST',
		type: 'POST',
		datatype:'text',
		url:'/api/checkout/change-address',
		data:({
			id : selectedContact,
		})
	});
});

$('#Modal-Contact-Save').on("click", function(){
	$("#phone-number").text($("input[type='radio'][name=contact]:checked").parent().find('strong').text());
	$("#summary-address").text($("input[type='radio'][name=contact]:checked").parent().find('b').text());
})