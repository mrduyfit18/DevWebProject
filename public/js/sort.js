
$('.sort-product').on("click",function(){
    $(this).parent().parent().find('li').removeClass('active');
    $(this).parent().addClass('active');
    filterChange($(this).data("id"));

})