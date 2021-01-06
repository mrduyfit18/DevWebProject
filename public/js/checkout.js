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

function AddContactButton_click(){
	$('#Modal-Add-Contact').modal('show');
}


$('#Modal-Adding-Contact-Save').on("click", async function(){
	event.preventDefault();

	const phoneNumber = $('#phone-number-adding').val();
	if(!checkValidPhoneNumber(phoneNumber)){
		$('#phone-number-err').html('Số điện thoại không hợp lệ!');
		return;
	}
	const address = $('#address-adding').val();

	if(address.length === 0){
		$('#address-err').html('Không được bỏ trống địa chỉ');
		return;
	}

	await $.ajax({
		url: '/api/contacts/add',
		type: 'POST',
		method: 'POST',
		data: {
			phoneNumber: phoneNumber,
			address: address
		},
		success: function (result){
			console.log(result);
			const template = Handlebars.compile($('#new-contact-template').html());
			const contactHtml = template({_id: result._id, phone: result.phone, address: result.address});
			$('#Modal-Contact-Body').append(contactHtml);
		}
	});
	await $('#Modal-Add-Contact').modal('hide');
	$('#address-err').html('');
	$('#phone-number-err').html('');
})
function checkValidPhoneNumber(phoneNumber) {
	if(phoneNumber.length!==10){
		return false;
	}
	const arr = phoneNumber.split('');

	return arr[0] === '0';

}

$('#address-adding').on('input', function(){
	$('#address-err').html('');
})
$('#phone-number-adding').on('input', function(){
	$('#phone-number-err').html('');
})

function checkoutSubmit() {
	const phone = $("#phone-number").text();
	const address = $("#summary-address").text();
	if(phone.length===0 || address.length===0) {
		alert('Địa chỉ chưa hợp lệ, vui lòng cập nhật lại!!');
	}
	else{
		$.post('/checkout/submit',function(data) {
			alert("Đơn hàng của bạn đã được tiếp nhận");
			window.location = window.location.origin;
		});
	}
}