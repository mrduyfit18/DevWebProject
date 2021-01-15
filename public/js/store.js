$(document).ready(function(){
	//Filter
		$('.filter .item > .controls').on('click', '.checkbox-group', async function(){
			if( $(this).attr('data-status') =='inactive' ){
				await  $(this).find('input').prop('checked', true);
				await $(this).attr('data-status','active'); }
			else{
				await $(this).find('input').prop('checked', false);
				await $(this).attr('data-status','inactive'); }
				filterChange();
		});


		$('.filter .item a[data-action="clear"]').on('click', function(){
			$(this).parents('.item').find('input').prop('checked', false);
			$(this).parents('.item').find('.checkbox-group').attr('data-status', 'inactive');
			filterChange();
		});
		

		$('.filter .item a[data-action="open"]').on('click', function(){
			if( $(this).attr('class') == 'down' ){
				$(this).removeClass('down').addClass('up');
				$(this).parents('.item').find('.title > a[data-action="clear-price"]').fadeIn('slow'); 
				$(this).parents('.item').find('.title > a[data-action="clear"]').fadeIn('slow'); 
				$(this).parents('.item').find('.controls').fadeIn('slow'); }
			else {
				$(this).removeClass('up').addClass('down');
				$(this).parents('.item').find('.title > a[data-action="clear-price"]').fadeOut('slow'); 
				$(this).parents('.item').find('.title > a[data-action="clear"]').fadeOut('slow'); 
				$(this).parents('.item').find('.controls').fadeOut('slow'); }
		});

		//Slider price
			$('.filter a[data-action="clear-price"]').on('click', function(){

				$( ".filter #slider-price" ).slider({ values: [ 0, 100 ] });
				filterChange();
				$( ".filter #amount" ).html( $( ".filter #slider-price" ).slider( "values", 0 )  + " triệu  - " +
			  	$( ".filter #slider-price" ).slider( "values", 1 ) + " triệu ");
			});

			if( $( "body" ).find('.filter').length > 0 ){
				$( ".filter #slider-price" ).slider({
				  range: true,
				  min: 0,
				  max: 100,
				  values: [ 0, 100 ],
				  slide: function( event, ui ) {
				    $( "#amount" ).html( ui.values[ 0 ] + " triệu - " + ui.values[ 1 ] + " triệu" );
				  }
				});
				$( ".filter #amount" ).html( $( "#slider-price" ).slider( "values", 0 )  + " triệu - " +
				  $( "#slider-price" ).slider( "values", 1 ) + " triệu" );
			}
		//Slider price
	//Filter

	//Favorites
		$('.products .product').on('click', 'a.favorites', function(){
			if( $(this).attr('data-favorite') == 'inactive' ){
				$(this).attr('data-favorite', 'active');
			}
			else{
				$(this).attr('data-favorite', 'inactive');
			}
		});
	//Favorites

	//Sorting
		$('.tags').on('click', 'button.dropdown-toggle', function(){
			if( $(this).find('i').attr('class') == 'ion-arrow-down-b rotate' ){
				$(this).find('i').removeClass('rotate'); }
			else{ $(this).find('i').addClass('rotate'); }

		});

		$('.tags').on('focusout', 'button.dropdown-toggle', function(){
			$(this).find('i').removeClass('rotate');
		});
	//Sorting

	//Cart
		//Toggle
			setTimeout(function(){ $('body').find('.cart').fadeIn('slow'); }, 1000);

			$('a[href="#open-cart"]').on('click', function(){
				$('body').attr('data-view', 'modal-open');
				$('body').find('.cart').attr('data-toggle', 'active');
			});
			

			$('.cart').on('click', '.label', function(){
				$('body').attr('data-view', 'modal-open');
				$(this).parents('.cart').attr('data-toggle', 'active');
				//$('body').find('.cart').fadeIn('slow');
			});
			
			$('.cart').on('click', 'button.close, .overlay', function(){
				$('body').attr('data-view', '');
				$(this).parents('.cart').attr('data-toggle', 'inactive');
				//$('body').find('.cart').fadeOut('slow');
			});
		//Toggle



		//Scroll
			$(".cart .content").mCustomScrollbar({
			    theme:"dark",
			    scrollButtons: false,
			    contentTouchScroll: true
			});
		//Scroll
	//Cart

	// Reviews
		//Scroll
			$(".comments .wrapper .content").mCustomScrollbar({
			    theme:"dark",
			    scrollButtons: false,
			    contentTouchScroll: true
			});
		//Scroll
	// Reviews
});